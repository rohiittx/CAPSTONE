import { request } from "express";
import { K8sCoreV1Api } from "./config.js";
import { V1VolumeMount } from "@kubernetes/client-node";

export async function createPod(sandboxId) {
 
    // ye hamne btaya h ki pod ka nmae ka kya hoga or vo kitne resources use krega 
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: "sandbox",
                sandboxId: sandboxId
            }
        },
        spec: {


            //workspace volume create kiya h ab dono container same volume share krenge but abhi sync nhi hue h
            // ye ek empty folder rhega 
            volumes: [
                {
                    name: "workspace-volume",
                    emptyDir: {}
                }
            ],
            /** init container vo containers hote h jo sabse pehle chalte h pod k normal containers se bhi pehle chalte h
             * ye apna kaam krte h fir apna kaam krke khtm ho jate h
             * 
            */
            initContainers: [
                {
                    name: "init-container",
                    image: "template",
                    imagePullPolicy: "IfNotPresent",
                    command: ["sh", "-c", "cp -r /workspace/. /seed/" ],
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/seed"
                        }
                    ]
                }
            ],
            containers: [
                {
                    // vite dev server ka container create kiya h
                    image: "template",
                    imagePullPolicy: "IfNotPresent",
                    name: "sandbox-container",
                    ports: [{
                        containerPort: 5173,
                        name: "http"
                     }],
                    resources: {
                        limits: {
                            cpu: "500m",
                            memory: "1Gi"
                        },
                        requests: {
                            cpu: "250m",
                            memory: "500Mi"
                        }

                    },
                    
                    // yha ham sync kr rhe h vite dev server container ko workspace_volume se
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                },
                {
                    // agent ka container create kiya h
                    image: "agent",
                    imagePullPolicy: "IfNotPresent",
                    name: "agent-container",
                    ports:[ { containerPort: 3000, name: "http" }],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi"},
                        request: { cpu: "250m", memory: "500Mi"}
                    },

                    // yha ham sync kr rhe h agent container ko workspace_volume se
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                }
            ]
        }
    }

    // ab pod create kr rhe h ham 
    const response = await K8sCoreV1Api.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })

    return response
}
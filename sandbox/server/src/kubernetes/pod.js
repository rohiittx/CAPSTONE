import { K8sCoreV1Api } from "./config";

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
            containers: [
                {
                    image: "template",
                    imagePullPolicy: "ifNotPresent",
                    name: "sandbox-container",
                    ports: [{
                        containerPort: 5173,
                        name: "http"
                     }],
                    resources: {
                        limits: {
                            cpu: "500m",
                            memory: "128Gi"
                        },
                        request: {
                            cpu: "250m",
                            memory: "500Mi"
                        }

                    }
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
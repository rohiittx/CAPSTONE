import { K8sCoreV1Api } from "./config";

export const createService = async (sandboxId) =>{

    // ye service k bare me btaya ki service jo ham service.yml me create krte h vo
    const serviceManifest = {
        metadat: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                app: "sandbox",
                sandboxId: sandboxId
            }
        },
        spec: {
            selector: {
                app: "sandbox",
                sandboxId: sandboxId
            },
            ports: [
                {
                    name: "http",
                    port: 80,
                    targetPort: 5173,
                    protocol: "TCP"
                }
            ],
            type: "ClusterIP"
        }
    }

    // ab service create krenge
    const response = await K8sCoreV1Api.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    })

    return response
}
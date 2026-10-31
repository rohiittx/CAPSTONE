import { K8sCoreV1Api } from "./config.js";

export const createService = async (sandboxId) => {
  const serviceManifest = {
    apiVersion: "v1",
    kind: "Service",

    metadata: {
      name: `sandbox-service-${sandboxId}`,
      namespace: "default",
      labels: {
        app: "sandbox",
        sandboxId: String(sandboxId),
      },
    },

    spec: {
      selector: {
        app: "sandbox",
        sandboxId: String(sandboxId),
      },

      ports: [
        {
          name: "http",
          port: 80,
          targetPort: 5173,
          protocol: "TCP",
        },
      ],

      type: "ClusterIP",
    },
  };

  if (!sandboxId) {
    throw new Error("sandboxId is missing");
  }
``
  if (!serviceManifest.metadata?.name) {
    throw new Error("Service metadata.name is missing");
  }

  const response = await K8sCoreV1Api.createNamespacedService({
    namespace: "default",
    body: serviceManifest,
  });

  return response;
};

// import { K8sCoreV1Api } from "./config.js";

// export const createService = async (sandboxId) =>{

//     // ye service k bare me btaya ki service jo ham service.yml me create krte h vo
//     const serviceManifest = {
//         metadata: {
//             name: `sandbox-service-${sandboxId}`,
//             labels: {
//                 app: "sandbox",
//                 sandboxId: sandboxId
//             }
//         },
//         spec: {
//             selector: {
//                 app: "sandbox",
//                 sandboxId: sandboxId
//             },
//             ports: [
//                 {
//                     name: "http",
//                     port: 80,
//                     targetPort: 5173,
//                     protocol: "TCP"
//                 }
//             ],
//             type: "ClusterIP"
//         }
//     }

//     // ab service create krenge
//     const response = await K8sCoreV1Api.createNamespacedService({
//         namespace: "default",
//         body: serviceManifest
//     })

//     return response
// }


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

console.log("sandboxId:", sandboxId);
console.log(
  "Service manifest:",
  JSON.stringify(serviceManifest, null, 2)
);

if (!sandboxId) {
  throw new Error("sandboxId is missing");
}

if (!serviceManifest.metadata?.name) {
  throw new Error("Service metadata.name is missing");
}

  const response = await K8sCoreV1Api.createNamespacedService({
    namespace: "default",
    body: serviceManifest,
  });

  return response;
};

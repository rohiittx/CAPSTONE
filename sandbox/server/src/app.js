import express from "express"
import morgan from "morgan"
import { createPod } from "./kubernetes/pod"
import { createService } from "./kubernetes/service"
import { v7 as uuid} from "uuid"


const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get("/api/sandbox/health", (req,res)=>{
    res.status(200).json({
        message: "Sandbox server is running",
        status: "okk"
    })
})

// ye ek api create kr rhe h jab user is api pr request krega to ek pod or service create hogi or ek sandboxId bhi generate hogi
app.post("/api/sandbox/start", async (req,res) =>{
    const sandboxId = uuid();

    await Promise.all([
        createPod(sandboxId),
        createService(sandboxId)
    ]);

    return res.status(201).json({
        message: "sandbox environment created successfully",
        sandboxId,
        previewUrl: `http://${sandboxId}.preview.localhost`
    })
});

export default app
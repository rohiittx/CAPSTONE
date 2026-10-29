import express from "express"
import morgan from "morgan"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.use(morgan("combined"))

app.get("/api/status/healthz",(req,res)=>{
    res.status(200).json({ status: "ok"})
})

app.get("/api/status/readyz",(req,res)=>{
    res.status(200).json({ status: "ready"})
})
 
const proxies = {}

function getProxy(sandboxId){

    const target = `http://sandbox-service-${sandboxId}` // construct traget url based on sandboxId

    if(!proxies[sandboxId]){
        proxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true
        })
    }
    return proxies[sandboxId]
}

app.use((req,res,next)=>{
    const host = req.headers.host
    const sandboxId = host.split(".")[0] 
    // extract sandboxId from subdomain eg=> jese pod1.preview.localhost h to mujhe pod1 chaiye to uske liye hamne split kiya h ise dot(".")
    //  k basis pr ki jo first dot se pehle ka ki values h usko select kro


    return getProxy(sandboxId)(req,res,next)
})

export default app
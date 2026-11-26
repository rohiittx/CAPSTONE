import express from "express"
import morgan from "morgan"
import fs from "fs"
import path from "path"


const WORKING_DIR = "/workspace";

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req,res)=>{
    res.status(200).json({
        message: "Hello from sandbox agent!",
        status: "success"
    })
})


/**
 * @route GET /list-files
 * @desc List all files in the working directory and its subdirectories. Returns a JSON oject 
 * with a file path relative to the working directory. Exclude directories like node_modules,
 * git,dist,.vscode, etc. 
 * @access Public
 * - eg. {
 *     "files": [
 *          "file1.txt",
 *          "src/file2.txt",
 *          "src/subdir/file3.txt"
 *    ]}
 */
app.get("/list-files", async (req,res)=>{

    const listFiles = async (dir,baseDir) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true })
        const files = []

        for( const entry of entries){
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.relative(baseDir, fullPath)
            
            if(entry.isDirectory() && !["node_modules",".git","dist",".vscode"].includes(entry.name)){
                continue
            }

            if(entry.isDirectory()){
                files.push(...await listFiles(fullPath, baseDir))
            } else {
                files.push(relativePath)
            }
        }

        return files
    }

    try{
        const files = await listFiles(WORKING_DIR, WORKING_DIR)
        res.status(200).json({
            message: "files in working directory",
            files
        })
    } catch (err){
        res.status(500).json({
            message: `Error listing files: ${err.message}`,
            status: "error"
        })
    }

    res.status(200).json({
        message: "Elements in working directory ",
        elements: files ,
        status: "success"
    })
})

/**
 * @route GET /read-files
 * @desc Read the content of all files requested in query parameter 'files and returns their content as a JSON object
 * @access Public
 * - eg. /read-files?files=file1.txt,file2.txt
 */

app.get("/read-files", async (req,res)=> {
    const files =req.query.files

    if(!files){
        return res.status(400).json({
            message: "No files specified in query parameter 'files'",
            status: "error"
        })
    }

    const filesList = files.split(",")

    const results = await Promise.all(filesList.map(async (file)=>{
        const filePath = `${WORKING_DIR}/${file}`
        try{
            const content = await fs.promises.readFile(filePath, 'utf-8')
            return {
                [ filePath.replace(WORKING_DIR, "")]: content
            }                   
        } catch (err){
            return res.status(500).json({
               [filePath.replace(WORKING_DIR, "")] : `Error reading file: ${err.message}`,
            })
        }
    }))

    return res.status(200).json({
        message: "Files read successfully",
        status: "success"
    })
})

/**
 * @route patch /update-file
 * @description update the content of the files specified in the request body. 
 * The request body should contain a property 'updates' with a JSON array of object, each object
 * should have a 'file' property specifying the file path (relative to the working directory) and 
 * a 'content' property specifying the new content for the file. 
 */

app.patch("/update-files", async (req,res)=>{

    const updates = req.body.updates

    if(!updates || !Array.isArray(updates)){
        return res.status(400).json({
            message: "Invalid request body. 'updates' should be an array of objects with 'file' and 'content' properties.",
            status: "error"
        })
    }

    const results = await Promise.all(updates.map(async (update)=>{
        const { files, content } = update
        const filePath = path.join(WORKING_DIR, files)

        try{
            await fs.promises.writeFile(filePath, content, 'utf-8')
            return {[ filePath ] : `File updated successfully`}
        } catch (err){
            return {[ filePath ] : `Error updating file: ${err.message}`}
        }
    }))

    return res.status(200).json({
        message: "Files updated successfully",
        results: results,
        status: "success"
    })
})

/**
 * @route POST /create-file
 * @description Create a new file with the specified content. 
 * The request body should contain a property 'file' specifying the file path (relative to the working directory) 
 * and a 'content' property specifying the content for the new file. 
 */
 
app.post("/create-file", async (req,res)=>{

    // const { file, content } = req.body
    const files = req.body.files

    if(!files || !Array.isArray(files)){
        return res.status(400).json({
            message: "Invalid request body. 'files' should be an array of file paths.",
            status: "error"
        })
    }

    const results = await Promise.all(files.map(async (fileObj) => {
        const { file, content } = fileObj
        const filePath = path.join(WORKING_DIR, file)

        try{
            await fs.promises.writeFile(filePath, content, 'utf-8')
            return {[ filePath ] : `File created successfully`}
        } catch (err){
            return res.status(500).json({
                [ filePath ] : `Error creating file: ${err.message}`,
            })
        }
    }))

    res.status(200).json({
        message: "Files created successfully",
        results: results,
        status: "success"
    }) 

}) 



export default app
import axios from "axios"
import { context, tool } from "langchain"
import * as z from "zod"


export const listFIles = tool(
    async ({ }) => {
        console.log("===============================")
        console.log("using list file tool")
        console.log("===============================")


        const response = await axios.get("")
        console.log("===============================")
        console.log("response from the list files tool", response.data)
        console.log("===============================")
        return JSON.stringify( response.data )
    },
    {
        name: "list_files",
        description: "List all the files inthe project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
)

export const readfiles = tool(
    async ({ files: []})=>{

        console.log("===============================")
        console.log("using read file tool")
        console.log("===============================")

        const response = await axios.get("")
        console.log("===============================")
        console.log("response from the read files tool", response.data)
        console.log("===============================")
        return JSON.stringify(response.data)
    },
    {
        name: "read-files",
        description: "Read the contents of specified files. This is useful for understanding the content of the files that are to the task at hand.",
        schema: z.object({
            files: z.array(z.string()).description("The list of files absoluite paths to read. these should be files that were listed using the list_files tool or created later ")
        })
    }
)

export const updateFiles = tool( 
    async ({ files })=>{
        console.log("===============================")
        console.log("using update file tool")
        console.log("===============================")


        const response = await axios.get("" , { updates: files})
         console.log("===============================")
        console.log("response from the update files tool ", response.data)
        console.log("===============================")
        return JSON.stringify(response.data.results)
    },
    {
        name: "update_files",
        description: "Update the contents of the specified files. This is useful for making changes to files based on the requirements of the task at hand. This tool can also use to create new files by providing a new file name in the file feild and the content to be added in the content feild.",
        schema: z.object({
            files: z.array(z.object({
                files: z.string().description("The abosulte path of the file to update"),
                content: z.string().describe("The new content for the file")
            })).describe("The list of the files to update and their new contents")
        })
    }
)
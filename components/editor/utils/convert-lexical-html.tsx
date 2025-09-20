"use client"

import { useEffect, useState } from "react"
import { createEditor } from "lexical"
import { $generateHtmlFromNodes } from "@lexical/html"
import { cn } from "@/lib/utils"

interface LexicalContentProps {
    content: string
    className?: string
}

export function LexicalContent({ content, className }: LexicalContentProps) {
    const [html, setHtml] = useState("")

    useEffect(() => {
        let parsed
        try {
            parsed = JSON.parse(content)
        } catch {
            setHtml(content)
            return
        }
        try {
            const editor = createEditor()
            const parsed = JSON.parse(content)
            editor.setEditorState(editor.parseEditorState(parsed))
            editor.update(() => {
                const htmlString = $generateHtmlFromNodes(editor)
                setHtml(htmlString)
            })
        } catch (e) {
            console.error("Failed to render Lexical content:", e)
            setHtml("<p>Invalid content</p>")
        }
    }, [content])

    return (
        <div
            className={cn("", className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}

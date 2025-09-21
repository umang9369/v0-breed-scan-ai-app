import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      return NextResponse.json({ success: false, error: "Missing image file" }, { status: 400 })
    }

    const workspace = process.env.ROBOFLOW_WORKSPACE
    const workflowId = process.env.ROBOFLOW_WORKFLOW_ID
    const apiKey = process.env.ROBOFLOW_API_KEY

    if (!workspace || !workflowId || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Roboflow configuration is missing. Please set ROBOFLOW_WORKSPACE, ROBOFLOW_WORKFLOW_ID, and ROBOFLOW_API_KEY" },
        { status: 500 },
      )
    }

    const arrayBuffer = await image.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mime = image.type || "image/jpeg"
    const dataUrl = `data:${mime};base64,${base64}`

    const url = `https://serverless.roboflow.com/${encodeURIComponent(workspace)}/workflows/${encodeURIComponent(workflowId)}`

    const payload = {
      api_key: apiKey,
      inputs: {
        image: {
          type: "base64",
          value: dataUrl,
        },
      },
      use_cache: true,
    }

    const rfRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const rfJson = await rfRes.json().catch(() => null)

    if (!rfRes.ok) {
      return NextResponse.json(
        { success: false, error: rfJson?.error || `Roboflow error ${rfRes.status}`, details: rfJson },
        { status: rfRes.status },
      )
    }

    return NextResponse.json({ success: true, data: rfJson })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Unexpected error" }, { status: 500 })
  }
}

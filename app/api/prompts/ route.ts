import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, title, prompt_text, category, created_at 
       FROM prompts 
       ORDER BY created_at DESC, id DESC`
    );
    return Response.json({ prompts: result.rows });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Cannot load prompts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, promptText, category } = body;

    if (!title?.trim() || !promptText?.trim()) {
      return Response.json({ error: "Check title and prompt" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO prompts (title, prompt_text, category) 
       VALUES ($1, $2, $3) RETURNING *`,
      [title.trim(), promptText.trim(), category?.trim() || ""]
    );

    return Response.json({ prompt: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Cannot save prompt" }, { status: 500 });
  }
}

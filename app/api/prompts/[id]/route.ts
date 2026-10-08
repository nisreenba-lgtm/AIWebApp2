import { pool } from "@/lib/db";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const { title, promptText, category } = body;

  try {
    const result = await pool.query(
      `UPDATE prompts 
       SET title = $1, prompt_text = $2, category = $3 
       WHERE id = $4 RETURNING *`,
      [title.trim(), promptText.trim(), category?.trim() || "", id]
    );

    if (result.rowCount === 0) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }
    return Response.json({ prompt: result.rows[0] });
  } catch (error) {
    return Response.json({ error: "Cannot update prompt" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;

  try {
    const result = await pool.query(
      `DELETE FROM prompts WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }
    return Response.json({ message: "Prompt deleted" });
  } catch (error) {
    return Response.json({ error: "Cannot delete prompt" }, { status: 500 });
  }
}

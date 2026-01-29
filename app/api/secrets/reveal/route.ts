import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  try {
    const { secretId } = await req.json();

    // 1️⃣ Auth via cookies (anon key + RLS)
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Service role (bypass RLS)
    const service = createServiceClient();

    const { data, error } = await service
      .from("secrets")
      .select("cipher_text")
      .eq("id", secretId)
      .single();

    if (error || !data) {
      console.error("DB error:", error);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // const value = new TextDecoder().decode(data.cipher_text);
    const hexString = data.cipher_text.replace("\\x", "");
    const base64Value = Buffer.from(hexString, "hex").toString("utf-8"); // Result: "YWJoaXNoZWs="
    const value = decodeFromBase64(base64Value); // Result: "abhishek"

    console.log("DECODED:", value); // This will now print "abhishek"

    return NextResponse.json({ value });

    return NextResponse.json({ value });
  } catch (err) {
    console.error("Reveal API crashed:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function decodeFromBase64(base64: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(
        Buffer.from(base64, "base64"),
        (x: number) => "%" + x.toString(16).padStart(2, "0")
      )
      .join("")
  );
}

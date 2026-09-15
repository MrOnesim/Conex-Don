/**
 * Générateur PDF minimal (sans dépendance) pour le press kit.
 * Produit un PDF valide : objets, table xref, polices Helvetica WinAnsi.
 */

type Block =
  | { type: "title"; text: string }
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "rule" }
  | { type: "space" };

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const MAX_W = PAGE_W - MARGIN * 2;

const WIDTH_FACTOR = { regular: 0.5, bold: 0.55 } as const;

type Line = {
  text: string;
  font: "regular" | "bold";
  size: number;
  color: [number, number, number];
};

function escapePdf(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, size: number, font: "regular" | "bold"): string[] {
  const charW = size * WIDTH_FACTOR[font];
  const max = Math.floor(MAX_W / charW);
  const words = text.split(/\s+/);
  const out: string[] = [];
  let current = "";
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max && current) {
      out.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) out.push(current);
  return out.length > 0 ? out : [""];
}

export function buildPressKitPdf(input: {
  blocks: Block[];
}): Uint8Array {
  const { blocks } = input;

  // 1. Mise en page.
  const pages: Line[][] = [];
  let current: Line[] = [];
  let y = PAGE_H - MARGIN;

  const push = (line: Line, height: number) => {
    if (y - height < MARGIN) {
      pages.push(current);
      current = [];
      y = PAGE_H - MARGIN;
    }
    current.push(line);
    y -= height;
  };

  blocks.forEach((block) => {
    if (block.type === "space") {
      y -= 12;
      return;
    }
    if (block.type === "rule") {
      push({ text: "", font: "regular", size: 1, color: [0, 0, 0] }, 14);
      return;
    }
    if (block.type === "title") {
      const lines = wrap(block.text.toUpperCase(), 24, "bold");
      lines.forEach((line) =>
        push({ text: line, font: "bold", size: 24, color: [0.03, 0.03, 0.03] }, 30),
      );
      y -= 8;
      return;
    }
    if (block.type === "heading") {
      y -= 10;
      const lines = wrap(block.text.toUpperCase(), 13, "bold");
      lines.forEach((line) =>
        push({ text: line, font: "bold", size: 13, color: [0.42, 0.29, 0.19] }, 18),
      );
      return;
    }
    const lines = wrap(block.text, 10.5, "regular");
    lines.forEach((line) =>
      push({ text: line, font: "regular", size: 10.5, color: [0.1, 0.1, 0.1] }, 16),
    );
    y -= 4;
  });
  pages.push(current);

  // 2. Flux de contenu.
  const contents = pages.map((lines) => {
    const parts: string[] = [];
    let cursor = PAGE_H - MARGIN;
    lines.forEach((line) => {
      const font = line.font === "bold" ? "/F2" : "/F1";
      const [r, g, b] = line.color;
      parts.push(
        `BT ${font} ${line.size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${MARGIN} ${cursor.toFixed(
          2,
        )} Tm (${escapePdf(line.text)}) Tj ET`,
      );
      cursor -= line.size === 1 ? 14 : line.size + 6;
    });
    return parts.join("\n");
  });

  // 3. Objets PDF.
  const objects: string[] = [];
  const pageCount = pages.length;
  const kids = Array.from({ length: pageCount }, (_, index) => `${5 + index * 2} 0 R`).join(" ");

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Count ${pageCount} /Kids [${kids}] >>`;
  objects[3] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[4] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

  contents.forEach((content, index) => {
    const pageObj = 5 + index * 2;
    const contentObj = pageObj + 1;
    objects[pageObj] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objects[contentObj] = `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`;
  });

  // 4. Assemblage + table xref.
  let body = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let index = 1; index < objects.length; index += 1) {
    const chunk = `${index} 0 obj\n${objects[index]}\nendobj\n`;
    offsets[index] = Buffer.byteLength(body, "latin1");
    body += chunk;
  }

  const xrefOffset = Buffer.byteLength(body, "latin1");
  const total = objects.length;
  let xref = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let index = 1; index < total; index += 1) {
    xref += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new Uint8Array(Buffer.from(body + xref + trailer, "latin1"));
}

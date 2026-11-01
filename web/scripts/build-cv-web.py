"""CV de la web (/cv), versión «AI Automation & Operations» en ES y EN.

Mismo diseño y misma base factual que los CV de la campaña del 27/10
(proposals/campana-laboral-2026-10-27/cv/build_cvs.py y NOTAS_FUENTES.md):
experiencia, formación, contacto y casos salen de ahí. Cambia el título (D1),
el perfil (los 4 servicios) y la ubicación, que no nombra el país (D7).

Uso, desde web/: python scripts/build-cv-web.py
Salida: public/cv/mario-morera-cv-es.pdf y public/cv/mario-morera-cv-en.pdf
"""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

OUT = Path(__file__).resolve().parent.parent / "public" / "cv"
OUT.mkdir(parents=True, exist_ok=True)
W, H = A4
L = 44
CW = W - 88
INK = HexColor("#152630")
MUTED = HexColor("#52636d")
CYAN = HexColor("#22a9c0")
RULE = HexColor("#dce6ea")
FONT = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Segoe", str(FONT / "segoeui.ttf")))
pdfmetrics.registerFont(TTFont("SegoeB", str(FONT / "segoeuib.ttf")))
pdfmetrics.registerFontFamily("Segoe", normal="Segoe", bold="SegoeB", italic="Segoe", boldItalic="SegoeB")
STYLES = {
    "body": ParagraphStyle("body", fontName="Segoe", fontSize=9.3, leading=13.4, textColor=INK),
    "small": ParagraphStyle("small", fontName="Segoe", fontSize=8.7, leading=12.3, textColor=INK),
}
PORT = "https://mmorera.agency/casos-de-exito"
LINKEDIN = "https://www.linkedin.com/in/mario-sergio-morera-escobar-9a16521a4"


def para(c, text, x, top, width, kind="body"):
    q = Paragraph(text, STYLES[kind])
    _, h = q.wrap(width, 1000)
    q.drawOn(c, x, top - h)
    return top - h


def section(c, title, y):
    c.setFillColor(CYAN); c.roundRect(L, y - 2, 3, 13, 1.5, fill=1, stroke=0)
    c.setFillColor(INK); c.setFont("SegoeB", 9.1); c.drawString(L + 11, y, title.upper())
    tw = pdfmetrics.stringWidth(title.upper(), "SegoeB", 9.1)
    c.setStrokeColor(RULE); c.line(L + 20 + tw, y + 3, W - L, y + 3)
    return y - 22


def experience(c, employer, role, dates, bullets, y):
    c.setFillColor(INK); c.setFont("SegoeB", 8.9); c.drawString(L, y, employer + "  |  " + role)
    c.setFillColor(MUTED); c.setFont("Segoe", 7.5); c.drawRightString(W - L, y, dates)
    y -= 12
    for b in bullets:
        y = para(c, "• " + escape(b), L + 7, y, CW - 7, "small") - 3
    return y - 11


def case(c, title, desc, url, y, label=""):
    heading = title + ("  |  " + label if label else "")
    c.setFillColor(INK); c.setFont("SegoeB", 8.5); c.drawString(L + 6, y, heading)
    tw = pdfmetrics.stringWidth(heading, "SegoeB", 8.5)
    c.linkURL(url, (L + 5, y - 2, L + 10 + tw, y + 11), relative=0, thickness=0)
    return para(c, escape(desc), L + 6, y - 5, CW - 12, "small") - 12


VERSIONS = {
    "es": dict(
        file="mario-morera-cv-es.pdf",
        role="AI Automation & Operations · Orquestador de tecnología",
        tag="AGENTES DE IA  |  AUTOMATIZACIÓN Y CRM  |  WEBS  |  CONTENIDO CON IA",
        contact="Remoto (UTC−3)  |  +598 92 323 675  |  mario@mmorera.agency",
        links="mmorera.agency/casos-de-exito  |  LinkedIn: mario-sergio-morera-escobar",
        h=["Perfil", "Habilidades", "Experiencia", "Casos seleccionados", "Formación e idiomas", "Disponibilidad"],
        lead="Orquesto la tecnología de negocios y equipos: webs, automatizaciones, agentes de IA y contenido con IA. Diseño y conecto el sitio, el CRM y los flujos, y coordino herramientas y modelos de IA para que trabajen juntos.",
        base="Me gusta entender qué necesita un proyecto, acordar prioridades y construir soluciones que se puedan usar y mantener. Aporto desarrollo, criterio visual y comunicación directa durante el trabajo.",
        skills=[
            ("Agentes de IA", "Claude, GPT y Gemini; MCP; coordinación de varios agentes con tareas, revisión y traspaso en mi propio flujo de trabajo."),
            ("Automatización y CRM", "GoHighLevel, n8n, APIs REST y webhooks; formularios, agenda, pipelines y seguimiento comercial."),
            ("Web", "Next.js, React, TypeScript, Tailwind CSS, Supabase y PostgreSQL; sitios bilingües y diseño responsive."),
            ("Contenido con IA", "Piezas y video con modelos de lenguaje e imagen y edición por código (Remotion), con revisión humana."),
        ],
        mm_role="AI Automation & Operations (independiente)", mm_dates="Ene 2023 - presente",
        mm=["Construyo webs, automatizaciones y agentes para negocios de servicios; conecto formularios, reservas y CRM con GoHighLevel, n8n, APIs y webhooks.",
            "Defino el alcance, las pruebas y la documentación de entrega; coordino modelos y herramientas de IA en el trabajo diario."],
        avlis_role="Desarrollador web", avlis_dates="Abr - nov 2025", avlis=["Desarrollo web para la empresa."],
        cases=[("Fenix Medical Center", "Sitio bilingüe en Next.js con reserva conectada a GoHighLevel.", "fenix-medical-center", ""),
               ("L&B Elite Wash & Detail", "Cotizador por vehículo y reserva sincronizados con GoHighLevel mediante webhooks.", "lb-elite-wash-detail", ""),
               ("New Brothers Barbería", "Demo con datos de muestra: reservas, CRM propio en Supabase y un asistente con base de conocimiento.", "new-brothers-barberia", "Demo personal")],
        edu="Bachillerato en Periodismo / Comunicación Social. Español nativo; inglés de conversación laboral.",
        avail="Jornada completa o proyectos. Remoto (UTC−3).",
    ),
    "en": dict(
        file="mario-morera-cv-en.pdf",
        role="AI Automation & Operations · Technology orchestrator",
        tag="AI AGENTS  |  AUTOMATION & CRM  |  WEBSITES  |  AI CONTENT",
        contact="Remote (UTC−3)  |  +598 92 323 675  |  mario@mmorera.agency",
        links="mmorera.agency/casos-de-exito  |  LinkedIn: mario-sergio-morera-escobar",
        h=["Profile", "Skills", "Experience", "Selected work", "Education & languages", "Availability"],
        lead="I orchestrate technology for businesses and teams: websites, automations, AI agents and AI content. I design and connect the website, the CRM and the workflows, and I coordinate tools and AI models so they work together.",
        base="I like understanding what a project needs, agreeing on priorities and building solutions people can use and maintain. I bring development skills, visual judgment and direct communication throughout the work.",
        skills=[
            ("AI agents", "Claude, GPT and Gemini; MCP; coordinating several agents with tasks, review and handoff in my own workflow."),
            ("Automation & CRM", "GoHighLevel, n8n, REST APIs and webhooks; forms, calendars, pipelines and sales follow-up."),
            ("Web", "Next.js, React, TypeScript, Tailwind CSS, Supabase and PostgreSQL; bilingual sites and responsive design."),
            ("AI content", "Posts and video with language and image models and code-based editing (Remotion), with human review."),
        ],
        mm_role="AI Automation & Operations (independent)", mm_dates="Jan 2023 - present",
        mm=["Build websites, automations and agents for service businesses; connect forms, bookings and CRM with GoHighLevel, n8n, APIs and webhooks.",
            "Define scope, checks and handoff documentation; coordinate AI models and tools in day-to-day work."],
        avlis_role="Web Developer", avlis_dates="Apr - Nov 2025", avlis=["Web development for the company."],
        cases=[("Fenix Medical Center", "Bilingual Next.js website with booking connected to GoHighLevel.", "fenix-medical-center", ""),
               ("L&B Elite Wash & Detail", "Vehicle-based quote and booking synchronized with GoHighLevel through webhooks.", "lb-elite-wash-detail", ""),
               ("New Brothers Barbershop", "Demo with sample data: bookings, a custom Supabase CRM and an assistant with a knowledge base.", "new-brothers-barberia", "Personal demo")],
        edu="Upper-secondary education in Journalism / Social Communication. Native Spanish; conversational English.",
        avail="Full-time or projects. Remote (UTC−3).",
    ),
}

for lang, v in VERSIONS.items():
    dest = OUT / v["file"]
    c = canvas.Canvas(str(dest), pagesize=A4, pageCompression=1)
    c.setTitle("Mario Morera | " + v["role"]); c.setAuthor("Mario Morera"); c.setSubject("CV")
    c.setFillColor(INK); c.rect(0, H - 139, W, 139, fill=1, stroke=0)
    c.setFillColor(CYAN); c.rect(0, H - 139, 5, 139, fill=1, stroke=0)
    c.setFillColor(white); c.setFont("SegoeB", 23); c.drawString(L, H - 43, "Mario Morera")
    c.setFillColor(HexColor("#78d7e5")); c.setFont("SegoeB", 10.5); c.drawString(L, H - 66, v["role"])
    c.setFillColor(HexColor("#cad8de")); c.setFont("Segoe", 7.9)
    c.drawString(L, H - 86, v["tag"]); c.drawString(L, H - 109, v["contact"]); c.drawString(L, H - 127, v["links"])
    mail_x = L + pdfmetrics.stringWidth(v["contact"].rsplit("mario@", 1)[0], "Segoe", 7.9)
    c.linkURL("mailto:mario@mmorera.agency", (mail_x, H - 112, mail_x + 90, H - 101), relative=0, thickness=0)
    c.linkURL(PORT, (L, H - 131, L + 181, H - 119), relative=0, thickness=0)
    c.linkURL(LINKEDIN, (L + 193, H - 131, W - L, H - 119), relative=0, thickness=0)
    h = v["h"]
    y = section(c, h[0], H - 161)
    y = para(c, escape(v["lead"]), L, y, CW)
    y = para(c, escape(v["base"]), L, y - 8, CW) - 22
    y = section(c, h[1], y)
    for head, body in v["skills"]:
        y = para(c, "<b>" + escape(head) + ":</b> " + escape(body), L + 3, y, CW - 3, "small") - 6
    y = section(c, h[2], y - 12)
    y = experience(c, "MMORERA", v["mm_role"], v["mm_dates"], v["mm"], y)
    y = experience(c, "AVLIS", v["avlis_role"], v["avlis_dates"], v["avlis"], y)
    y = section(c, h[3], y - 8)
    for title, desc, slug, label in v["cases"]:
        y = case(c, title, desc, PORT + "/" + slug, y, label)
    y = section(c, h[4], y - 3)
    y = para(c, escape(v["edu"]), L, y, CW, "small")
    y = section(c, h[5], y - 18)
    y = para(c, escape(v["avail"]), L, y, CW, "small")
    c.setStrokeColor(RULE); c.line(L, 41, W - L, 41)
    c.setFillColor(MUTED); c.setFont("Segoe", 7.1); c.drawString(L, 27, "PORTFOLIO  " + PORT); c.drawRightString(W - L, 27, "2026")
    c.linkURL(PORT, (L, 22, L + 260, 37), relative=0, thickness=0)
    if y < 53:
        raise ValueError(f"Overflow {dest}: {y}")
    c.save()
    print(dest.name, "bottom", round(y, 1))

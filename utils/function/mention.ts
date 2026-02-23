const MENTION_REGEX = /(^|[^\p{L}\p{N}_@])@([\p{L}\p{N}](?:[\p{L}\p{N}_-]{0,35}))/gu

export function renderMentionHtml(html: string): string {
  if (typeof window === "undefined" || !html.includes("@")) {
    return html
  }

  const parser = new DOMParser()
  const documentNode = parser.parseFromString(`<div>${html}</div>`, "text/html")
  const container = documentNode.body.firstElementChild

  if (!container) {
    return html
  }

  const walker = documentNode.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue &&
      node.parentElement &&
      !node.parentElement.closest("a,[data-mention-handle]")
    ) {
      textNodes.push(node as Text)
    }
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue ?? ""
    if (!text.includes("@")) {
      return
    }

    let lastIndex = 0
    let hasMention = false
    const fragment = documentNode.createDocumentFragment()

    for (const match of text.matchAll(MENTION_REGEX)) {
      const prefix = match[1] ?? ""
      const handle = match[2] ?? ""
      const fullMatch = match[0] ?? ""
      const fullIndex = match.index ?? -1

      if (!handle || fullIndex < 0) {
        continue
      }

      const mentionStart = fullIndex + prefix.length
      const mentionEnd = mentionStart + fullMatch.length - prefix.length

      if (mentionStart > lastIndex) {
        fragment.appendChild(documentNode.createTextNode(text.slice(lastIndex, mentionStart)))
      }

      const mentionNode = documentNode.createElement("a")
      mentionNode.textContent = `@${handle}`
      mentionNode.setAttribute("data-mention-handle", handle)
      mentionNode.setAttribute("href", `/imitation-x/user/${handle}`)
      mentionNode.className = "mention-handle"
      fragment.appendChild(mentionNode)

      lastIndex = mentionEnd
      hasMention = true
    }

    if (!hasMention) {
      return
    }

    if (lastIndex < text.length) {
      fragment.appendChild(documentNode.createTextNode(text.slice(lastIndex)))
    }

    textNode.replaceWith(fragment)
  })

  return container.innerHTML
}

export function getMentionHandleFromTarget(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) {
    return null
  }

  const mention = target.closest("[data-mention-handle]")
  if (!mention) {
    return null
  }

  return mention.getAttribute("data-mention-handle")
}

export function getMentionHrefFromTarget(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) {
    return null
  }

  const mention = target.closest("[data-mention-handle]")
  if (!mention) {
    return null
  }

  return mention.getAttribute("href")
}

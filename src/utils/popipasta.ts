export function initPopipasta(siteName: string, siteUrl: string): void {
  const currentYear = new Date().getFullYear();

  document.oncopy = (e: ClipboardEvent): void => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length < 30) return;

    const range = selection.getRangeAt(0);
    const clonedContent = range.cloneContents();

    clonedContent.querySelectorAll("li").forEach((li) => {
      li.insertBefore(document.createTextNode("- "), li.firstChild);
    });

    const wrapper = document.createElement("div");
    wrapper.appendChild(clonedContent);

    const pageUrl = window.location.href;
    const attribution = `\n\n★ Extract from ${pageUrl}\n★ 2012-${currentYear} © ${siteName.toUpperCase()} \n★ Broadcasting from ${siteUrl}`;
    const attributionHtml = `<br/><br/>★ Extract from: <a href="${pageUrl}">${pageUrl}</a><br/>★ 2012-${currentYear} © ${siteName.toUpperCase()} `;

    const plainText = wrapper.innerText + attribution;
    wrapper.insertAdjacentHTML("beforeend", attributionHtml);

    e.preventDefault();
    e.clipboardData?.setData("text/plain", plainText);
    e.clipboardData?.setData("text/html", wrapper.innerHTML);
  };
}

interface CarbonData {
  c: string; // carbon grams
  p: string; // percentage cleaner than
  t?: number; // timestamp
}

export function initWebsiteCarbon(): void {
  const wcID = (id: string): HTMLElement | null => document.getElementById(id);
  const wcU = encodeURIComponent(window.location.href);

  const newRequest = function (shouldRender = true): void {
    fetch(`https://api.websitecarbon.com/b?url=${wcU}`)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data: CarbonData) => {
        if (shouldRender) renderResult(data);
        data.t = new Date().getTime();
        localStorage.setItem(`wcb_${wcU}`, JSON.stringify(data));
      })
      .catch((error) => {
        const gElement = wcID("wcb_g");
        if (gElement) gElement.innerHTML = "No Result";
        console.log(error);
        localStorage.removeItem(`wcb_${wcU}`);
      });
  };

  const renderResult = function (data: CarbonData): void {
    const gElement = wcID("wcb_g");
    const twoElement = wcID("wcb_2");

    if (gElement) {
      gElement.innerHTML = `${data.c}g of CO<sub>2</sub>/view`;
    }
    if (twoElement) {
      twoElement.insertAdjacentHTML(
        "beforeEnd",
        `Cleaner than ${data.p}% of pages tested`,
      );
    }
  };

  const wcStyles = `
    <style>
      #wcb.carbonbadge {
        --b1: #0e11a8;
        --b2: #00ffbc;
        font-size: 15px;
        text-align: center;
        color: var(--b1);
        line-height: 1.15;
      }
      #wcb.carbonbadge sub {
        vertical-align: middle;
        position: relative;
        top: 0.3em;
        font-size: 0.7em;
      }
      #wcb #wcb_2,
      #wcb #wcb_a,
      #wcb #wcb_g {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 1em;
        line-height: 1.15;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        text-decoration: none;
        margin: 0.2em 0;
      }
      #wcb #wcb_a,
      #wcb #wcb_g {
        padding: 0.3em 0.5em;
        border: 0.13em solid var(--b2);
      }
      #wcb #wcb_g {
        border-radius: 0.3em 0 0 0.3em;
        background: #fff;
        border-right: 0;
        min-width: 8.2em;
      }
      #wcb #wcb_a {
        border-radius: 0 0.3em 0.3em 0;
        border-left: 0;
        background: var(--b1);
        color: #fff;
        font-weight: 700;
        border-color: var(--b1);
      }
      #wcb.wcb-d #wcb_a {
        color: var(--b1);
        background: var(--b2);
        border-color: var(--b2);
      }
      #wcb.wcb-d #wcb_2 {
        color: #fff;
      }
    </style>
  `;

  const wcBadge = wcID("wcb");

  if (!wcBadge) {
    console.error("Element with id 'wcb' not found");
    return;
  }

  if ("fetch" in window) {
    wcBadge.insertAdjacentHTML("beforeEnd", wcStyles);
    wcBadge.insertAdjacentHTML(
      "beforeEnd",
      `<div id="wcb_p">
        <span id="wcb_g">Measuring CO<sub>2</sub>&hellip;</span>
        <a id="wcb_a" target="_blank" rel="noopener" href="https://websitecarbon.com">Website Carbon</a>
      </div>
      <span id="wcb_2">&nbsp;</span>`,
    );

    const cachedData = localStorage.getItem(`wcb_${wcU}`);
    const currentTime = new Date().getTime();
    const dayInMs = 86400000; // 24 hours in milliseconds

    if (cachedData) {
      const parsedData: CarbonData = JSON.parse(cachedData);
      renderResult(parsedData);

      // Refresh if data is older than 24 hours
      if (parsedData.t && currentTime - parsedData.t > dayInMs) {
        newRequest(false);
      }
    } else {
      newRequest();
    }
  }
}

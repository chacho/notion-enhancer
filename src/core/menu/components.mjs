/**
 * notion-enhancer
 * (c) 2023 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (https://notion-enhancer.github.io/) under the MIT license
 */

import { setState, useState } from "./state.mjs";

function Sidebar({}, ...children) {
  const { html } = globalThis.__enhancerApi;
  return html`<aside
    class="notion-enhancer--menu-sidebar min-w-[224.14px] max-w-[250px]
    h-full overflow-y-auto bg-[color:var(--theme--bg-secondary)]"
  >
    ${children}
  </aside>`;
}

function SidebarSection({}, ...children) {
  const { html } = globalThis.__enhancerApi;
  return html`<h2
    class="text-([11px] [color:var(--theme--fg-secondary)])
    py-[5px] px-[15px] mb-px mt-[18px] first:mt-[10px]
    uppercase font-medium tracking-[0.03em] leading-none"
  >
    ${children}
  </h2>`;
}

function SidebarButton({ icon, ...props }, ...children) {
  const { html } = globalThis.__enhancerApi,
    iconSize = icon.startsWith("notion-enhancer")
      ? "w-[17px] h-[17px] ml-[1.5px] mr-[9.5px]"
      : "w-[18px] h-[18px] ml-px mr-[9px]",
    $el = html`<${props.href ? "a" : "button"}
      class="flex select-none cursor-pointer w-full
      items-center py-[5px] px-[15px] text-[14px] last:mb-[12px]
      transition hover:bg-[color:var(--theme--bg-hover)]"
      ...${props}
    >
      <i class="i-${icon} ${iconSize}"></i>
      <span class="leading-[20px]">${children}</span>
    <//>`;
  if (!props.href) {
    const id = $el.innerText;
    $el.onclick ??= () => setState({ view: id });
    useState(["view"], ([view = "welcome"]) => {
      const active = view.toLowerCase() === id.toLowerCase();
      $el.style.background = active ? "var(--theme--bg-hover)" : "";
      $el.style.fontWeight = active ? "600" : "";
    });
  }
  return $el;
}

function View({ id }, ...children) {
  const { html } = globalThis.__enhancerApi,
    $el = html`<article
      id=${id}
      class="notion-enhancer--menu-view h-full
      overflow-y-auto px-[60px] py-[36px] grow"
    >
      ${children}
    </article>`;
  useState(["view"], ([view = "welcome"]) => {
    const active = view.toLowerCase() === id.toLowerCase();
    $el.style.display = active ? "" : "none";
  });
  return $el;
}

function Option({ type, value, description, _update, ...props }) {
  const { html } = globalThis.__enhancerApi,
    camelToSentenceCase = (string) =>
      string[0].toUpperCase() +
      string.replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`).slice(1);

  let $input;
  const label = props.label ?? camelToSentenceCase(props.key),
    onchange = (event) => _update(event.target.value);
  switch (type) {
    case "heading":
      return html`<h3
        class="notion-enhancer--menu-heading font-semibold
      mb-[16px] mt-[48px] first:mt-0 pb-[12px] text-[16px]
      border-b border-b-[color:var(--theme--fg-border)]"
      >
        ${label}
      </h3>`;
    case "text":
      $input = html`<${TextInput} ...${{ value, onchange }} />`;
      break;
    case "number":
      $input = html`<${NumberInput} ...${{ value, onchange }} />`;
      break;
    case "hotkey":
      $input = html`<${HotkeyInput} ...${{ value, onchange }} />`;
      break;
    case "color":
      $input = html`<${ColorInput} ...${{ value, onchange }} />`;
      break;
    case "file":
      try {
        value = JSON.parse(value);
      } catch {
        value = {};
      }
      $input = html`<${FileInput}
        filename="${value.filename}"
        extensions="${props.extensions}"
        onupload=${(upload) => _update(JSON.stringify(upload))}
      />`;
      break;
    case "select":
      $input = html`<${Select}
        values=${props.values}
        ...${{ value, onchange }}
      />`;
      break;
    case "toggle":
      $input = html`<${Toggle}
        checked=${value}
        onchange=${(event) => _update(event.target.checked)}
      />`;
  }
  return html`<${type === "toggle" ? "label" : "div"}
    class="notion-enhancer--menu-option flex items-center justify-between
    mb-[18px] ${type === "toggle" ? "cursor-pointer" : ""}"
    ><div class="flex flex-col ${type === "text" ? "w-full" : "mr-[10%]"}">
      <h4 class="text-[14px] mb-[2px] mt-0">${label}</h4>
      ${type === "text" ? $input : ""}
      <p
        class="text-[12px] leading-[16px]
        text-[color:var(--theme--fg-secondary)]"
        innerHTML=${description}
      ></p>
    </div>
    ${type === "text" ? "" : $input}
  <//>`;
}

function TextInput({ value, ...props }) {
  const { html } = globalThis.__enhancerApi;
  return html`<label
    class="notion-enhancer--menu-text-input
    relative block w-full mt-[4px] mb-[8px]"
  >
    <input
      type="text"
      class="appearance-none text-[14px] leading-[1.2] rounded-[4px] pb-px
      h-[28px] w-full pl-[8px] pr-[30px] bg-[color:var(--theme--bg-hover)]"
      value=${value}
      ...${props}
    />
    <i
      class="i-text-cursor pointer-events-none
      absolute right-[8px] top-[6px] w-[16px] h-[16px]
      text-[color:var(--theme--fg-secondary)]"
    ></i>
  </label>`;
}

function NumberInput({ value, ...props }) {
  const { html } = globalThis.__enhancerApi;
  return html`<label
    class="notion-enhancer--menu-number-input
    relative shrink-0 w-[192px]"
  >
    <input
      type="number"
      class="appearance-none text-[14px] leading-[1.2] rounded-[4px] pb-px
      h-[28px] w-full pl-[8px] pr-[32px] bg-[color:var(--theme--bg-hover)]"
      value=${value}
      ...${props}
    />
    <i
      class="i-hash pointer-events-none
      absolute right-[8px] top-[6px] w-[16px] h-[16px]
      text-[color:var(--theme--fg-secondary)]"
    ></i>
  </label>`;
}

function HotkeyInput({ value, onkeydown, ...props }) {
  const { html } = globalThis.__enhancerApi,
    updateHotkey = (event) => {
      event.preventDefault();
      const keys = [];
      for (const modifier of ["metaKey", "ctrlKey", "altKey", "shiftKey"]) {
        if (!event[modifier]) continue;
        const alias = modifier[0].toUpperCase() + modifier.slice(1, -3);
        keys.push(alias);
      }
      if (!keys.length && ["Backspace", "Delete"].includes(event.key)) {
        event.target.value = "";
      } else if (event.key) {
        let key = event.key;
        if (key === " ") key = "Space";
        if (["+", "="].includes(key)) key = "Plus";
        if (key === "-") key = "Minus";
        if (event.code === "Comma") key = ",";
        if (event.code === "Period") key = ".";
        if (key === "Control") key = "Ctrl";
        // avoid e.g. Shift+Shift, force inclusion of non-modifier
        if (keys.includes(key)) return;
        keys.push(key.length === 1 ? key.toUpperCase() : key);
        event.target.value = keys.join("+");
      }
      event.target.dispatchEvent(new Event("input"));
      event.target.dispatchEvent(new Event("change"));
    };
  props.onkeydown = (event) => {
    updateHotkey(event);
    onkeydown?.(event);
  };

  return html`<label
    class="notion-enhancer--menu-hotkey-input
    relative shrink-0 w-[192px]"
  >
    <input
      type="text"
      class="appearance-none text-[14px] leading-[1.2] rounded-[4px] pb-px
      h-[28px] w-full pl-[8px] pr-[32px] bg-[color:var(--theme--bg-hover)]"
      value=${value}
      ...${props}
    />
    <i
      class="i-command pointer-events-none
      absolute right-[8px] top-[6px] w-[16px] h-[16px]
      text-[color:var(--theme--fg-secondary)]"
    ></i>
  </label>`;
}

function ColorInput({ value, ...props }) {
  const { html } = globalThis.__enhancerApi,
    updateContrast = ($input, $icon) => {
      $input.style.background = $input.value;
      const [r, g, b, a = 1] = $input.value
        .replace(/^rgba?\(/, "")
        .replace(/\)$/, "")
        .split(",")
        .map((n) => parseFloat(n));
      if (a > 0.5) {
        // pick a contrasting foreground for an rgb background
        // using the percieved brightness constants from http://alienryderflex.com/hsp.html
        const brightness = 0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b);
        $input.style.color = Math.sqrt(brightness) > 165.75 ? "#000" : "#fff";
      } else $input.style.color = "#000";
      $icon.style.color = $input.style.color;
    };

  const $input = html`<input
      type="text"
      class="appearance-none text-[14px] leading-[1.2]
      h-[28px] w-full pl-[8px] pr-[32px] pb-px"
      style="background: ${value}"
      value=${value}
      data-coloris
      ...${props}
    />`,
    $icon = html`<i
      class="i-pipette pointer-events-none absolute opacity-70
      right-[8px] top-[6px] w-[16px] h-[16px] text-current"
    ></i>`,
    { oninput } = $input;
  $input.oninput = (event) => {
    oninput?.(event);
    updateContrast($input, $icon);
  };
  updateContrast($input, $icon);
  Coloris({ format: "rgb" });

  return html`<label
    class="notion-enhancer--menu-color-input shrink-0
    relative overflow-hidden rounded-[4px] w-[192px] bg-(
      [image:repeating-linear-gradient(45deg,#aaa_25%,transparent_25%,transparent_75%,#aaa_75%,#aaa),repeating-linear-gradient(45deg,#aaa_25%,#fff_25%,#fff_75%,#aaa_75%,#aaa)]
      [position:0_0,4px_4px]
      [size:8px_8px]
    )"
  >
    ${$input}${$icon}
  </label>`;
}

function FileInput({ filename, extensions, onupload, onchange, ...props }) {
  const { html } = globalThis.__enhancerApi,
    $filename = html`<span>${filename || "Upload a file"}</span>`,
    $clear = html`<button
      class="ml-[8px] h-[14px] cursor-pointer text-[color:var(--theme--fg-secondary)]
      transition duration-[20ms] hover:text-[color:var(--theme--fg-primary)]"
      style=${filename ? "" : "display: none"}
      onclick=${() => {
        $filename.innerText = "Upload a file";
        $clear.style.display = "none";
        onupload?.({ filename: "", content: "" });
      }}
    >
      <i class="i-x w-[14px] h-[14px]"></i>
    </button>`;
  props.onchange = (event) => {
    const file = event.target.files[0],
      reader = new FileReader();
    reader.onload = async (progress) => {
      const content = progress.currentTarget.result,
        upload = { filename: file.name, content };
      $filename.innerText = file.name;
      $clear.style.display = "";
      onupload?.(upload);
    };
    reader.readAsText(file);
    onchange?.(event);
  };
  return html`<div
    class="notion-enhancer--menu-file-input shrink-0 flex items-center"
  >
    <label
      tabindex="0"
      class="flex items-center cursor-pointer select-none
      h-[28px] text-[14px] leading-[1.2] px-[8px] rounded-[4px]
      text-[color:var(--theme--fg-secondary)] bg-[color:var(--theme--bg-secondary)] 
      transition duration-[20ms] hover:bg-[color:var(--theme--bg-hover)]"
    >
      <input
        type="file"
        class="hidden"
        accept=${extensions
          ?.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`))
          .join(",")}
        ...${props}
      />
      <i class="i-file-up w-[16px] h-[16px] mr-[6px]"></i>
      ${$filename}
    </label>
    ${$clear}
  </div>`;
}

function Select({ values, value, onchange, ...props }) {
  const { html } = globalThis.__enhancerApi,
    updateWidth = ($select) => {
      const $tmp = html`<span
        class="text-[14px] pl-[8px] pr-[28px]
        absolute top-[-9999px] left-[-9999px]"
        >${$select.value}</span
      >`;
      document.body.append($tmp);
      requestAnimationFrame(() => {
        $select.style.width = `${Math.min($tmp.offsetWidth, 256)}px`;
        $tmp.remove();
      });
    };
  props.onchange = (event) => {
    onchange?.(event);
    updateWidth(event.target);
  };

  const $select = html`<select
    class="appearance-none bg-transparent rounded-[4px] cursor-pointer
    text-[14px] leading-[1.2] pl-[8px] pr-[28px] h-[28px] max-w-[256px]
    transition duration-[20ms] hover:bg-[color:var(--theme--bg-hover)]"
    ...${props}
  >
    ${values.map((value) => {
      return html`<option
        value=${value}
        class="bg-[color:var(--theme--bg-secondary)]
        text-[color:var(--theme--fg-primary)]"
      >
        ${value}
      </option>`;
    })}
  </select>`;
  $select.value = value ?? $select.value;
  updateWidth($select);

  return html`<div class="notion-enhancer--menu-select relative">
    ${$select}
    <i
      class="i-chevron-down pointer-events-none
      absolute right-[6px] top-[6px] w-[16px] h-[16px]
      text-[color:var(--theme--fg-secondary)]"
    ></i>
  </div>`;
}

function Toggle(props) {
  const { html } = globalThis.__enhancerApi;
  return html`<div class="notion-enhancer--menu-toggle shrink-0">
    <input
      tabindex="-1"
      type="checkbox"
      class="hidden checked:sibling:children:(
      bg-[color:var(--theme--accent-primary)] after:translate-x-[12px])"
      ...${props}
    />
    <div
      tabindex="0"
      class="w-[30px] h-[18px] transition duration-200
      rounded-[44px] bg-[color:var(--theme--bg-hover)]"
    >
      <div
        class="w-full h-full rounded-[44px] p-[2px]
        hover:bg-[color:var(--theme--bg-hover)]
        transition duration-200 after:(
          inline-block w-[14px] h-[14px] rounded-[44px]
          bg-[color:var(--theme--accent-primary\\_contrast)]
          transition duration-200
        )"
      ></div>
    </div>
  </div>`;
}

export {
  Sidebar,
  SidebarSection,
  SidebarButton,
  View,
  Option,
  TextInput,
  NumberInput,
  HotkeyInput,
  ColorInput,
  FileInput,
  Select,
  Toggle,
};

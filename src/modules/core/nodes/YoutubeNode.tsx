import { mergeAttributes } from "@tiptap/core";
import Youtube, { YoutubeOptions } from "@tiptap/extension-youtube";

type YoutubeNodeOptions = YoutubeOptions & {
  containerStyles?: string;
  frameStyles?: string;
};

export const getYoutubeEmbedUrl = (nocookie: boolean) => {
  return nocookie
    ? "https://www.youtube-nocookie.com/embed/"
    : "https://www.youtube.com/embed/";
};

const getEmbedUrlFromYoutubeUrl = (options: Record<string, any>) => {
  const {
    url,
    allowFullscreen,
    autoplay,
    ccLanguage,
    ccLoadPolicy,
    controls,
    disableKBcontrols,
    enableIFrameApi,
    endTime,
    interfaceLanguage,
    ivLoadPolicy,
    loop,
    modestBranding,
    nocookie,
    origin,
    playlist,
    progressBarColor,
    startAt,
  } = options;

  // if is already an embed url, return it
  if (url.includes("/embed/")) {
    return url;
  }

  // if is a youtu.be url, get the id after the /
  if (url.includes("youtu.be")) {
    const id = url.split("/").pop();

    if (!id) {
      return null;
    }
    return `${getYoutubeEmbedUrl(nocookie)}${id}`;
  }

  const videoIdRegex = /v=([-\w]+)/gm;
  const matches = videoIdRegex.exec(url);

  if (!matches || !matches[1]) {
    return null;
  }

  let outputUrl = `${getYoutubeEmbedUrl(nocookie)}${matches[1]}`;

  const params = [];

  if (allowFullscreen === false) {
    params.push("fs=0");
  }

  if (autoplay) {
    params.push("autoplay=1");
  }

  if (ccLanguage) {
    params.push(`cc_lang_pref=${ccLanguage}`);
  }

  if (ccLoadPolicy) {
    params.push("cc_load_policy=1");
  }

  if (!controls) {
    params.push("controls=0");
  }

  if (disableKBcontrols) {
    params.push("disablekb=1");
  }

  if (enableIFrameApi) {
    params.push("enablejsapi=1");
  }

  if (endTime) {
    params.push(`end=${endTime}`);
  }

  if (interfaceLanguage) {
    params.push(`hl=${interfaceLanguage}`);
  }

  if (ivLoadPolicy) {
    params.push(`iv_load_policy=${ivLoadPolicy}`);
  }

  if (loop) {
    params.push("loop=1");
  }

  if (modestBranding) {
    params.push("modestbranding=1");
  }

  if (origin) {
    params.push(`origin=${origin}`);
  }

  if (playlist) {
    params.push(`playlist=${playlist}`);
  }

  if (startAt) {
    params.push(`start=${startAt}`);
  }

  if (progressBarColor) {
    params.push(`color=${progressBarColor}`);
  }

  if (params.length) {
    outputUrl += `?${params.join("&")}`;
  }

  return outputUrl;
};

const YoutubeNode = Youtube.extend<YoutubeNodeOptions>({
  renderHTML({ HTMLAttributes }) {
    const embedUrl = getEmbedUrlFromYoutubeUrl({
      url: HTMLAttributes.src,
      allowFullscreen: this.options.allowFullscreen,
      autoplay: this.options.autoplay,
      ccLanguage: this.options.ccLanguage,
      ccLoadPolicy: this.options.ccLoadPolicy,
      controls: this.options.controls,
      disableKBcontrols: this.options.disableKBcontrols,
      enableIFrameApi: this.options.enableIFrameApi,
      endTime: this.options.endTime,
      interfaceLanguage: this.options.interfaceLanguage,
      ivLoadPolicy: this.options.ivLoadPolicy,
      loop: this.options.loop,
      modestBranding: this.options.modestBranding,
      nocookie: this.options.nocookie,
      origin: this.options.origin,
      playlist: this.options.playlist,
      progressBarColor: this.options.progressBarColor,
      startAt: HTMLAttributes.start || 0,
    });

    HTMLAttributes.src = embedUrl;

    return [
      "div",
      { "data-youtube-video": "", style: this.options.containerStyles },
      [
        "iframe",
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            width: this.options.width,
            height: this.options.height,
            allowfullscreen: this.options.allowFullscreen,
            autoplay: this.options.autoplay,
            ccLanguage: this.options.ccLanguage,
            ccLoadPolicy: this.options.ccLoadPolicy,
            disableKBcontrols: this.options.disableKBcontrols,
            enableIFrameApi: this.options.enableIFrameApi,
            endTime: this.options.endTime,
            interfaceLanguage: this.options.interfaceLanguage,
            ivLoadPolicy: this.options.ivLoadPolicy,
            loop: this.options.loop,
            modestBranding: this.options.modestBranding,
            origin: this.options.origin,
            playlist: this.options.playlist,
            progressBarColor: this.options.progressBarColor,
            style: this.options.frameStyles,
          },
          HTMLAttributes
        ),
      ],
    ];
  },

  parseHTML: () => {
    return [
      {
        tag: "div[data-youtube-video] iframe",
      },
      {
        tag: "iframe",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const isYoutube = (node as HTMLIFrameElement).src.match(
            "youtube.com"
          );
          return isYoutube ? {} : false;
        },
      },
    ];
  },
});

export default YoutubeNode;

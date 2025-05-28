import { Command } from "commander";
import { PagesType } from "./types";
import { defaultOptions } from "./utils";
import {
  validateBackground,
  validateImgType,
  validateInput,
  validateIntent,
  validateMaxHeight,
  validateMaxWidth,
  validateNameTemplate,
  validateOutput,
  validatePages,
  validateScale,
  validateScaleForBrowserSupport,
} from "./validators";

export const program = new Command();

program
  .name("pdftoimg")
  .description("Convert PDF pages to images (png/jpg)")
  .requiredOption("-i, --input <input>", "Input PDF file path")
  .option(
    "-o, --out <outputDir>",
    "Directory to save output images (default: current directory)",
  )
  .option(
    "-t, --imgType <type>",
    "Image type: png or jpg",
    String(defaultOptions.imgType),
  )
  .option(
    "-s, --scale <scale>",
    "Scale factor (positive number)",
    String(defaultOptions.scale),
  )
  .option(
    "-p, --pages <pages...>",
    "Pages to convert: 'all', 'firstPage', 'lastPage', numbers or ranges like 1..3",
    String(defaultOptions.pages),
  )
  .option(
    "-n, --name <template>",
    "Naming template for output files (use {i} for index, {p} for page number, {ext} for extension, {f} for filename)",
  )
  .option(
    "-ps, --password <password>",
    "Password for the PDF file if encrypted",
  )
  .option(
    "-in, --intent <intent>",
    "Rendering intent: 'display', 'print', or 'any'",
    "display",
  )
  .option(
    "-b, --background <color>",
    "Background color (e.g., 'white', 'rgba(255,255,255,0.5)', '#ffffff')",
    "rgb(255,255,255)",
  )
  .option(
    "-mw, --maxWidth <maxWidth>",
    "Maximum width for the rendered canvas",
    String(defaultOptions.maxWidth),
  )
  .option(
    "-mh, --maxHeight <maxHeight>",
    "Maximum height for the rendered canvas",
    String(defaultOptions.maxHeight),
  )
  .option(
    "-sb, --scaleForBrowserSupport <scaleForBrowserSupport>",
    "Scale for browser support",
    String(defaultOptions.scaleForBrowserSupport),
  );

export interface CLIOptions {
  input: string;
  out?: string;
  imgType: string;
  scale: string | number;
  pages: string | number;
  name?: string;
  password?: string;
  intent?: string;
  background?: string;
  maxWidth?: string | number;
  maxHeight?: string | number;
  scaleForBrowserSupport?: string | boolean;
}

export function validatePrompts(opts: CLIOptions) {
  const inputPath = validateInput(opts.input);
  const outputPath = validateOutput(opts.out);
  const imgType = validateImgType(opts.imgType) as "jpg" | "png";
  const scale = validateScale(String(opts.scale));
  const pages = validatePages(String(opts.pages)) as PagesType;
  const intent = validateIntent(opts.intent || "display");
  const background = validateBackground(opts.background || "rgb(255,255,255)");
  const nameTemplate = validateNameTemplate(inputPath, opts.name);
  const maxWidth = validateMaxWidth(String(opts.maxWidth));
  const maxHeight = validateMaxHeight(String(opts.maxHeight));
  const scaleForBrowserSupport = validateScaleForBrowserSupport(
    String(opts.scaleForBrowserSupport),
  );

  return {
    inputPath,
    outputPath,
    imgType,
    scale,
    pages,
    nameTemplate,
    password: opts.password,
    intent,
    background,
    maxWidth,
    maxHeight,
    scaleForBrowserSupport,
  };
}

import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setPublicDir(path.resolve(process.cwd(), "public"));
Config.setOverwriteOutput(true);
// Allow large MOV/video files more time to load during render
Config.setDelayRenderTimeoutInMilliseconds(60000);

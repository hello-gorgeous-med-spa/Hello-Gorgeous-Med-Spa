import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Allow large MOV/video files more time to load during render
Config.setDelayRenderTimeoutInMilliseconds(60000);

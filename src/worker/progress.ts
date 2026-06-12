export function progress(title: string, message: string, value: number) {
  self.postMessage({ type: "progress", title, message, progress: value });
}

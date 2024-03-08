import { stream } from "@netlify/functions";

// @ts-expect-error async streams are allowed
export const handler = stream(async () => {
  const encoder = new TextEncoder();
  const formatter = new Intl.DateTimeFormat("en", { timeStyle: "medium" });
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("<html><body><ol>"));
      let i = 0;
      const timer = setInterval(() => {
        controller.enqueue(
          encoder.encode(
            `<li>Hello at ${formatter.format(new Date())}</li>\n\n`,
          ),
        );
        if (i++ >= 5) {
          controller.enqueue(encoder.encode("</ol></body></html>"));
          controller.close();
          clearInterval(timer);
        }
      }, 1000);
    },
  });
  return {
    headers: {
      "content-type": "text/html",
    },
    statusCode: 200,
    body,
  };
});

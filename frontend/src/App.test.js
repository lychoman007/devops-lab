import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("renders backend health data", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          status: "success",
          database_time: {
            now: "2026-05-16T00:00:00.000Z",
          },
        }),
    })
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/Backend Status: success/i)).toBeInTheDocument();
  });

  expect(
    screen.getByText(/Database Time: 2026-05-16T00:00:00.000Z/i)
  ).toBeInTheDocument();
});

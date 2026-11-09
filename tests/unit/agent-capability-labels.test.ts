import { describe, expect, test } from "bun:test";
import { describeAgentCapability, isAgentModelCapability } from "@/lib/agent/capability-labels";

describe("agent capability labels", () => {
  test("shows readable names for supported capabilities", () => {
    expect((["toolCalling", "structuredOutput", "streaming"] as const).map(describeAgentCapability)).toEqual([
      "tool calling",
      "schema-valid tool arguments",
      "streaming",
    ]);
  });

  test("keeps only known capabilities from a server response", () => {
    const received: unknown[] = ["toolCalling", "futureCapability", null, 42, "streaming"];

    expect(received.filter(isAgentModelCapability)).toEqual(["toolCalling", "streaming"]);
  });

  test("does not accept inherited object properties as capabilities", () => {
    for (const value of ["constructor", "toString", "__proto__"]) {
      expect(isAgentModelCapability(value)).toBe(false);
    }
  });

  test("accepts each capability the server can report", () => {
    for (const value of ["toolCalling", "structuredOutput", "streaming"]) {
      expect(isAgentModelCapability(value)).toBe(true);
    }
  });

  test("requires the exact capability name", () => {
    for (const value of ["ToolCalling", "toolcalling", " toolCalling", "toolCalling ", ""]) {
      expect(isAgentModelCapability(value)).toBe(false);
    }
  });

  test("rejects non-string values even when they resemble a capability name", () => {
    for (const value of [new String("toolCalling"), ["toolCalling"], { toString: () => "toolCalling" }]) {
      expect(isAgentModelCapability(value)).toBe(false);
    }
  });
});

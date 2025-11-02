import { formatDate, debounce } from "../lib/utils";

describe("Utils", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date);
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("2024");
      expect(formatted).toContain("15");
    });

    it("should handle different dates", () => {
      const date = new Date("2023-12-25");
      const formatted = formatDate(date);
      expect(formatted).toContain("Dec");
      expect(formatted).toContain("2023");
      expect(formatted).toContain("25");
    });

    it("should handle edge case dates", () => {
      const date = new Date("2024-01-01");
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe("string");
    });

    it("should format future dates", () => {
      const date = new Date("2025-06-30");
      const formatted = formatDate(date);
      expect(formatted).toContain("2025");
      expect(formatted).toContain("Jun");
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();

    afterEach(() => {
      jest.clearAllTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should create a debounced function", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      expect(typeof debouncedFn).toBe("function");
      expect(mockFn).not.toHaveBeenCalled();
    });

    it("should delay function execution", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should only call function once if called multiple times quickly", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should reset timer on each call", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      
      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should pass arguments correctly", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("arg1", "arg2");
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    });
  });
});

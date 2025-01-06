export default defineEventHandler((event) => ({
  headers: getRequestHeaders(event),
}));

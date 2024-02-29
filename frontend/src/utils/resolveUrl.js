export default function resolveUrl(url) {
    return process.env.NODE_ENV === "production" ? url : "http://localhost:3001" + url;
}
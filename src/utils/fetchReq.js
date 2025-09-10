class TenorApi {
    constructor(term) {
        this.term = term;
    }

    async grabData() {
        const { tenor_apikey } = require("../config.json");
        const clientkey = "my_test_app";
        const lmt = 10;
        const search_url = `https://tenor.googleapis.com/v2/search?q=${this.term}&key=${tenor_apikey}&client_key=${clientkey}&limit=${lmt}`;

        const res = await fetch(search_url);
        if (!res.ok) throw new Error(`Tenor API error: ${res.status}`);
        const json = await res.json();

        const results = json.results;
        if (!results || results.length === 0) {
            return null;
        }

        const index = Math.round(Math.random() * (results.length-1));
        return results[index].media_formats.mediumgif.url;
    }
}

module.exports = TenorApi;

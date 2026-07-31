
export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    res.status(501).json({
        error: "Voice API not connected yet."
    });

}

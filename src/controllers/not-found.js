export default async function notFound () {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        body: { error: 'Not Found.' },
        statusCode: 404
    }
}
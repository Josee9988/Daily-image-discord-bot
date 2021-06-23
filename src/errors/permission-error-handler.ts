/**
 * Super basic error handler, which only displays a console error.
 * @param messageSend the message that was about to send, or any info related.
 * @param error the possible error that caused the catch.
 */
export default function permissionErrorHandler(messageSend: string, error?: any): void {
    console.error(`Couldn't send the message "${messageSend}"\nError found. ${error}`)
}
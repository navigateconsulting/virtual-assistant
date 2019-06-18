import aiohttp
import asyncio
from skype_bot import SkypeBot
import uvloop
from config import CONFIG
import signal


# Main Class
# Using Application EvaConnector

async def main():
    bot = SkypeBot()
    queue = asyncio.Queue()

    signal.signal(signal.SIGTERM, bot.sigterm_handler)

    try:
        await bot.setup_ucwa(discover_url=CONFIG.get('skype_connector', 'discover_url'),
                             username=CONFIG.get('skype_connector', 'username'),
                             password=CONFIG.get('skype_connector', 'password'),
                             client_id=CONFIG.get('skype_connector', 'client_id'),
                             tenant_id=CONFIG.get('skype_connector', 'tenant_id'),
                             rasa_url=CONFIG.get('skype_connector', 'rasa_url')
                             )

        report_my_activity = asyncio.create_task(bot.task_report_my_activity())
        events = asyncio.create_task(bot.task_process_events(queue))

        process_message = [asyncio.create_task(bot.task_process_and_reply(queue)) for _ in range(10)]

        await report_my_activity
        await events

        await asyncio.gather(*process_message)
        await queue.join()

    except KeyboardInterrupt:
        print("Inside Keyboard Interrupt")
        await bot.close_session()
        asyncio.gather(*asyncio.all_tasks()).cancel()

uvloop.install()
asyncio.run(main())

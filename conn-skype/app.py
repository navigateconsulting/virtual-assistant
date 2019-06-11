import aiohttp
import asyncio
from skype_bot import SkypeBot
import uvloop


# Main Class
# Using Application EvaConnector

async def main():
    bot = SkypeBot()
    queue = asyncio.Queue()
    try:
        await bot.setup_ucwa(discover_url="http://lyncdiscover.navigateconsulting.in",
                             username="daas@navigateconsulting.in",
                             password="Cfxdzs@123",
                             client_id="830b6148-30da-4b86-a621-e7d724241f7a",
                             tenant_id='2f892c02-6a40-43d0-840d-f2485c93fd06'
                             )

        report_my_activity = asyncio.create_task(bot.task_report_my_activity())
        events = asyncio.create_task(bot.task_process_events(queue))

        process_message = [asyncio.create_task(bot.task_process_and_reply(queue)) for _ in range(10)]

        await report_my_activity
        await events

        await asyncio.gather(*process_message)
        await queue.join()

    except:
        await bot.close_session()
        asyncio.gather(*asyncio.all_tasks()).cancel()

uvloop.install()
asyncio.run(main())

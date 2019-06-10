import aiohttp
import asyncio
from skype_bot import SkypeBot


# Main Class
# Using Application EvaConnector

async def main():
    bot = SkypeBot()
    await bot.setup_ucwa("http://lyncdiscover.navigateconsulting.in",
                         "daas@navigateconsulting.in",
                         "Cfxdzs@123",
                         "830b6148-30da-4b86-a621-e7d724241f7a")
    await bot.close_session()

asyncio.run(main())

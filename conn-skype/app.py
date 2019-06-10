import aiohttp
import asyncio
from skype_bot import SkypeBot


# Main Class
# Using Application EvaConnector

async def main():
    bot = SkypeBot()
    await bot.setup_ucwa(discover_url="http://lyncdiscover.navigateconsulting.in",
                         username="daas@navigateconsulting.in",
                         password="Cfxdzs@123",
                         client_id="830b6148-30da-4b86-a621-e7d724241f7a",
                         tenant_id='2f892c02-6a40-43d0-840d-f2485c93fd06'
                         )
    await bot.close_session()

asyncio.run(main())

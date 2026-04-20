# KitScout
<table>
  <tr>
    <td width="60%" valign="middle" style="padding-right: 20px;">

KitScout is a web-scraper-based price aggregator for Gunpla kits that allows users to search for and wishlist kits they’re interested in. I built KitScout to help Gunpla enthusiasts track and compare prices across multiple vendor storefronts and find the best deal on their next kit.

  </td>
    <td width="40%" align="center" valign="middle">
  <img 
    src="https://github.com/user-attachments/assets/eef93e6e-f0e8-40f6-b3f4-ddfe062b112c" 
    width="220"
    style="border-radius: 8px;" 
  />
</td>
  </tr>
</table>

**Link:**

## How It's Made:

<p>
  <strong>Tech Used: </strong>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Cheerio-5FA04E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white" />
</p>

KitScout was built with a focus on performance, scalability, and clean data flow across the stack. I initially developed an MVP by leveraging publicly available JSON endpoints exposed by various storefronts, 
which allowed me to quickly prototype the aggregation logic and validate the core idea. From there, I transitioned to more robust, full-fledged web scrapers using Cheerio to parse HTML directly, 
giving me greater flexibility and control over the data being extracted. I designed KitScout using Next.js to handle both the frontend and API layer, which allowed me to centralize scraping logic and control how external data is fetched and served. 
To avoid excessive or redundant scraping requests, I implemented a Redis caching layer that stores recently fetched product data and significantly reduces response times. 

On the client side, I used TanStack Query to manage asynchronous data fetching, caching, 
and background updates, which helped keep the UI responsive while minimizing unnecessary network calls. Throughout the project, I prioritized type safety and maintainability by using TypeScript, and I structured the codebase to separate concerns between scraping, 
caching, and presentation. Building KitScout required thinking carefully about trade-offs between data freshness and performance, and it gave me hands-on experience working with real-world constraints like rate limiting, data consistency, and efficient state management.

---

## Optimization:

I also focused heavily on optimizing performance across both the client and server. Using `Next.js`, I strategically combined server-side rendering and client-side data fetching to balance fast initial load times with dynamic, up-to-date data. 
Initial page loads are handled on the server, while TanStack Query manages client-side fetching, caching, and background updates after hydration to keep the UI responsive. Using TanStack Query and Redis to implement a multi-layered caching system 
reduced repeated search latency from 3.8s to under 50ms (approximately 75× faster) and decreased redundant API calls by 60–70%. This approach me to maintain fresh data without sacrificing performance, while also making the system more efficient under repeated usage.

---

## Lessons Learned:

This project was my first experience using a majority of the technnologies in this stack including Next.js, TypeScript, TanStack Query, Redis, Cheerio, and Tailwind CSS. Through building KitScout, I was able to leverage my existing knowledge of React to rapidly learn and apply the features
and architectural patterns of Next.js. My focus on performance pushed me to experiment with caching strategies to minimize repetitive API requests and response latency. On the frontend, I refined my knowledge of developing reusable UI components to create 
a clean, modular code structure with a clear seperation of presentation and business logic. Additionally, using Tailwind CSS encouraged a mobile-first approach, allowing me to efficiently build a responsive and adaptable user interface with its streamlined syntax.

The largest challenge I faced during this project was with scraping dynamic websites; While Cheerio offers light-weight scraping, it is unable to scrape content from dynamic, JS-heavy sites, and thus I was forced to exclude some vendor storefronts from KitScout. To attempt to solve this issue,
I explored alternative scraping libraries such as Puppeteer and Playwright, but found that using headless browser scrapers introduced an unacceptable amount of request latency and were simply too resource intensive for the application.
Finally, familiarizing myself with TypeScript was another challenge I encountered during development of this project; Adapting to the statically-typed nature of TypeScript forced me to make explicit type definitions at every level. This, at first, was a headache.
However, it ultimately helped me to ensure the integrity and shape of data throughout the entire stack; More work up-front saved me from debugging issues down the road.

---

## Conclusion:

Overall, KitScout served as a strong blend of a passion project and a wonderful learning experience. I thouroughly enjoyed working with Next.js and found its features ironed out a plethora of the minor annoyances I found in my experience with React. TanStack Query and Redis
were also really enjoyable to work with, allowing me to create blazing-fast request speeds and reduce load on vendor storefronts. In particular, TanStack Query's automatic refresh feature was extremely convenient and helpful to work with. Moving forward, I'm excited to continue
working with these technologies and exploring more of what they have to offer!

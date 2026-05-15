# CSLab - SQL Injection Lab
This lab is designed to teach you about SQL Injection (SQLi) vulnerabilities, how to identify them, and how to exploit them to extract sensitive information from a database. The lab is structured in multiple levels, each focusing on a specific type of SQLi vulnerability. By the end of this lab, you will have a solid understanding of SQLi and how to prevent it in your applications.

---

## Installation

### Windows

1. **Install Docker Desktop**
   - Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
   - Launch Docker Desktop and wait until it shows **"Engine running"** in the bottom-left corner.

2. **Install Git**
   - Download and install [Git for Windows](https://git-scm.com/download/win).
   - During setup, keep the default options. This installs **Git Bash**, which you will use in the next steps.

3. **Clone the repository**
   - Open **Git Bash** (search for it in the Start menu).
   - Run:
     ```sh
     git clone git@github.com:CS-lab-CISUC/sqli-lab.git
     cd sqli-lab
     ```

4. **Start the lab**
   ```sh
   docker compose up -d
   ```

5. Open `http://localhost` in your browser.

---

### Linux / Mac

1. **Install Docker**
   - **Mac**: Download and install [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop). Docker Compose is included.
   - **Linux**: Follow the [official Docker Engine install guide](https://docs.docker.com/engine/install/) for your distro, then install Docker Compose:
     ```sh
     sudo apt install docker-compose
     # or follow the guide for other distros
     ```

2. **Clone the repository**
   ```sh
   git clone git@github.com:CS-lab-CISUC/sqli-lab.git
   cd sqli-lab
   ```

3. **Start the lab**
   ```sh
   docker compose up -d
   ```

4. Open `http://localhost` in your browser.

---

## Types of SQLi Vulnerabilities
### In-Band (Classic) SQLi
This is the most common type of SQLi, where the attacker can directly see the results of their injection through the same channel they are using to inject the payload. This can be further divided into two subtypes:
- **Union-Based SQLi**: The attacker uses the UNION SQL operator to combine the results of the original query with the results of a malicious query, allowing them to retrieve data from other tables.
- **Error-Based SQLi**: The attacker relies on the error messages returned by the server to gather information about the database structure and the data it contains.
Additionally, in-band SQLi can also include authentication bypass techniques, where the attacker injects payloads that manipulate the authentication logic to gain unauthorized access.

### Inferential (Blind) SQLi
In this type of SQLi, the attacker cannot see the results of their injection directly. Instead, they have to infer information based on the behavior of the application/ responses it gives. This can be further divided into two subtypes:
- **Boolean-Based Blind SQLi**: The attacker sends payloads that result in a true or false response from the server, allowing them to infer information based on the application's behavior.
- **Time-Based Blind SQLi**: The attacker sends payloads that cause a delay in the server's response, allowing them to infer information based on the time it takes for the server to respond. Often leveraging functions such as `SLEEP()` in MySQL or `WAITFOR DELAY` in SQL Server.

### Out-of-Band (OOB) SQLi
This type of SQLi occurs when the attacker cannot use the same channel to receive the results of an injection on the server. Instead, they have to use a different channel to receive the results, such as an email or a DNS request. This type of SQLi is less common but can be more difficult to detect and mitigate.

## Classification by Execution Time
Additionally, an SQLi can be classified by its execution time:
- **First-Order SQLi**: The payload is executed immediately as part of the same request in which it is injected. For example, when a user submits a form with an SQLi payload, and the server processes it right away.
- **Second-Order SQLi**: The payload is stored by the app and executed at a later time, such as when an administrator views a log or a user profile.

---

## Lab Structure
The lab is structured by levels, each level focuses on a specific type of SQLi vulnerability and unlocks the next one. The levels are designed to gradually increase in difficulty and complexity, allowing you to build your skills and knowledge step by step. Each level has a writeup that explains the vulnerability, how to exploit it, and how to prevent it. [writeups](writeups/). Start on level 1 and each vulnerability will redirect you to the next one.
### Level 1: In-Band SQLi — `http://localhost/login`
- [Level 1-1: Login bypass](writeups/1-1.md)
- [Level 1-2: Where clause manipulation](writeups/1-2.md)
- [Level 1-3: Extraction of database structure/ data using UNION](writeups/1-3.md)
- [Level 1-4: Error-based data extraction](writeups/1-4.md)
### Level 2: Blind SQLi — `http://localhost/tickets`
- [Level 2-1: Boolean-based blind SQLi](writeups/2-1.md)
- [Level 2-2: Time-based blind SQLi](writeups/2-2.md)
- [Level 2-3: Second-order SQLi](writeups/2-3.md)
### Level 3: Advanced / Chained — `http://localhost/oob`
- [Level 3-1: OOB SQLi](writeups/3-1.md)
- [Level 3-2: WAF/filter bypass techniques](writeups/3-2.md)
- [Level 3-3: SQLi on superuser to RCE](writeups/3-3.md)

---

## What's Next?

If you completed this lab congratulations! You now have a solid understanding of SQLi vulnerabilities, how to exploit them and how to prevent them. However, there are more advanced techniques and variations that are not covered in this lab, such as:

- **Other databases** — all levels use PostgreSQL. MySQL, MSSQL, SQLite, and Oracle each have different syntax, functionsm quirks and where metadata is stored.
- **Automated tooling** — [sqlmap](https://sqlmap.org/) automates detection and exploitation of most in-band and blind SQLi. This lab deliberately leaves that out to build manual understanding first.
- **Real WAFs** — Level 3-2 has a very basic filter bypass, but real-world WAFs are much more complex and require a wider range of evasion techniques. Encoding tricks (chunked transfer, parameter pollution, header injection) used to sneak payloads past WAFs and proxies.
- **ORM-specific injection** — Modern applications often use ORMs (Object Relational Mappers), not direct SQL queries. SQLi can also occur in the context of Object-Relational Mappers (ORMs) like Prisma, Django ORM, or SQLAlchemy, which have their own quirks and potential injection points.
- **NoSQL injection** — MongoDB, Redis, and similar databases have their own injection classes that are structurally different from SQL injection.
- **Exploitation at scale** — automating extraction character-by-character, handling pagination, rate limiting, and parallelising blind injection over many requests.
- **Post-exploitation** — what to do after you have RCE or DB access: pivoting, credential reuse, privilege escalation inside the OS.
- **Who knows?** - The world of cybersecurity is always evolving, maybe you can discover new techniques and attack vectors that are not covered in this lab!

---

## Get to know CS-Lab
CyberSecurity Laboratory [CS-Lab](https://cs-lab.cisuc.uc.pt/)
 is a transversal laboratory of CISUC, promoting CyberSecurity research, activities, challenges like Capture The Flag (CTF), Ethical Hacking, and learning through academia partnerships.

The CS-Lab includes cybersecurity researchers, professors, students which have a passion for security. The CS-Lab also participates in research and development activities, including international colaboration projects. 

The CS-Lab provides access to cybersecurity academias, which are promoted by major vendos of security solutions like PaloAlto, Fortinet, Cisco among others.

The CS-Lab borned from the First Foundation initiative on 2024 with funds to set up a initial infrastructure to support the different activities. 

CS-lab is currently under the coordination of Bruno Sousa and João R. Campos.

## Contact Us
- [Events @ CS-Lab Discord Server](https://discord.com/invite/Rya5cBQACD)
- [Miguelagsilva Discord User](https://discord.com/users/268061003936169984) - author of the sqli-lab
- cslab@dei.uc.pt

---

## Useful Resources
- [CS-Lab Website](https://cs-lab.cisuc.uc.pt/)
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [OWASP SQLi Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [PortSwigger SQLi Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
- [PWN College Web Security](https://pwn.college/intro-to-cybersecurity/web-security/)

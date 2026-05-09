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
- The lab is structured by levels, each level focuses on a specific type of SQLi vulnerability and unlocks the next one.
### Level 1: In-Band SQLi
- Level 1-1: Login bypass
- Level 1-2: Where clause manipulation
- Level 1-3: Extraction of database structure/ data using UNION
- Level 1-4: Error-based data extraction
### Level 2: Blind SQLi
- Level 2-1: Boolean-based blind SQLi
- Level 2-2: Time-based blind SQLi
- Level 2-3: Second-order SQLi
### Level 3: Advanced / Chained
- Level 3-1: OOB SQLi using DNS exfiltration
- Level 3-2: WAF/filter bypass techniques
- Level 3-3: Chaining SQLi with other vulnerabilities (e.g. RCE, SSRF)

---

### Useful Resources
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [OWASP SQLi Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [PortSwigger SQLi Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
- [PWN College Web Security](https://pwn.college/intro-to-cybersecurity/web-security/)

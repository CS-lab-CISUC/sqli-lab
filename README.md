# sqli-lab
SQLi vulnerable applications for learning purposes

---

## Types of SQLi Vulnerabilities
### In-Band (Classic) SQLi
This is the most common type of SQLi, where the attacker can directly see the results of their injection through the same channel they are using to inject the payload. This can be further divided into two subtypes:
- **Error-Based SQLi**: The attacker relies on the error messages returned by the server to gather information about the database structure and the data it contains.
- **Union-Based SQLi**: The attacker uses the UNION SQL operator to combine the results of the original query with the results of a malicious query, allowing them to retrieve data from other tables.

### Inferential (Blind) SQLi
In this type of SQLi, the attacker cannot see the results of their injection directly. Instead, they have to infer information based on the behavior of the application/ responses it gives. This can be further divided into two subtypes:
- **Boolean-Based Blind SQLi**: The attacker sends payloads that result in a true or false response from the server, allowing them to infer information based on the application's behavior.
- **Time-Based Blind SQLi**: The attacker sends payloads that cause a delay in the server's response, allowing them to infer information based on the time it takes for the server to respond. Often leveraging functions such as `SLEEP()` in MySQL or `WAITFOR DELAY` in SQL Server.

### Out-of-Band (OOB) SQLi
This type of SQLi occurs when the attacker cannot use the same channel to receive the results of an injection on the server. Instead, they have to use a different channel to receive the results, such as an email or a DNS request. This type of SQLi is less common but can be more difficult to detect and mitigate.

---

## Lab Structure
- The lab is structured by levels, each level focuses on a specific type of SQLi vulnerability and unlocks the next one.
### Level 1: In-Band SQLi
- Level 1-1: Login bypass
- Level 1-2: Where clause manipulation
- Level 1-3: Extraction of database structure/ data using UNION
- Level 1-4: Error-based data extraction
### Level 2: Inferential SQLi
- Level 2-1: Boolean-based blind SQLi
- Level 2-2: Time-based blind SQLi
### Level 3: Out-of-Band SQLi
- Level 3-1: OOB SQLi using DNS exfiltration

---

### Useful Resources
- [PortSwigger SQLi Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [OWASP SQLi Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [PWN College Web Security](https://pwn.college/intro-to-cybersecurity/web-security/)

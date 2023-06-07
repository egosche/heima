<!--lint disable no-literal-urls-->
<p align="center">
    <img
      alt="Heima"
      src="https://github.com/EGoesche/apm/blob/master/Resources/Heima_landing_page.png"
      width="300"
    />
</p>

# Heima - Web App for Booking and Renting Accommodation

Heima is Icelandic and means 'home'. Heima allows users to rent out their own accommodations to other users. It is a web app that consists of a React frontend and NodeJS backend. MySQL is used as the database.
Note: This project was developed in the context of a student research project. The project has several critical security vulnerabilities. It is not intended for productive use.

## Overview

- Installation
- Functions
- Authors

## Installation

The Heima project should be made usable on your computer with the help of this installation. The frontend and backend will get their own container together. Additionally a MySQL database runs in a second container.

### 1. Build Docker Images

Navigate to the 'Heima' folder and run the following
command here:

```
docker build -t heima-image .
```

Then go back to the root folder and navigate to the folder 'HeimaDB' and execute the command:

```
docker build -t heimadb-image .
```

The two Heima images should now be created and visible under the `docker images` command.

### 2. Build Docker Container

If you are now no longer in the 'HeimaDB' folder, change to the
to this folder and create the two containers with the command

```
docker-compose up
```

### 3. Run Container

After the containers are created with the compose command, they start automatically. From the Docker Dashboard, the containers can also be
run the containers as well.  
The frontend runs on port 3000 and the backend on port 30001. Accordingly, both can be accessed through a web browser under the respective address (e.g. localhost:3000). The MySQL server runs
on port 3307.

### Notes

In order to be able to explore Heima faster or more effectively, test data has already been loaded onto the system. Among other things, two user accounts are available:

    LANDLORD
    E-Mail: volkibau@gmx.com
    PW:     Chemnitz1

    USER (Tenant)
    E-Mail: vilive@gmail.com
    PW:     Chemnitz1

Of course, new user accounts can also be created via the registration.

### Troubleshooting

#### Ports

In order to prevent possible collisions, the corresponding port of the database has already been set to 3307 instead of the standard 3306. However, ports may still need to be changed. This can be done manually in the docker-compose.yml (in the HeimaDB folder).

#### Backend Connection Error

If content like room information or user data is not loaded, most likely the backend is not started correctly. In rare cases it happens that the Docker container for the frontend and backend is started before the container for the database. As a result, the backend cannot connect to the database and shuts down after a few attempts. To fix this error, only the container for frontend and backend has to be restarted.

#### UTF8 Encoding Failure

After the home project was transferred to Docker, it was noticed that the German umlauts were not displayed correctly. Even after intensive search the the exact culprit could not be found. As a kind of workaround a function was implemented in the backend, which corrects the wrongly coded characters. However, in exceptional cases there could still be display errors. We apologize for this.

## Functions

- User management
- Accommodation management
- Bookings
- Rating System
- Authentification

## Authors

- **Julia** - _IT Security Advisor_
- **Natalia** - _Project Manager_
- **Juliet** - _Database Engineer_
- **Christian** - _Documentation Specialist_
- **Dave** - _Software Tester_
- **Steven** - _Development Manager_
- **Erik** - _Team Leader_ - [EGoesche](https://github.com/EGoesche)

To learn who additionally worked on this project, please read the contributors file.

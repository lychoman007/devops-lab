# DevOps Lab

This lab runs a small full-stack app with:

- `frontend`: React app
- `backend`: Express API
- `postgres`: PostgreSQL database
- `nginx`: reverse proxy
- `Jenkinsfile`: CI/CD pipeline definition

## Run with Docker Compose

From `devops-lab`:

```bash
docker compose up --build
```

Open:

- App: `http://localhost`
- API health: `http://localhost/api/health`

## Services

- Nginx listens on port `80`
- Backend listens on port `5000`
- Frontend listens on port `3000`
- PostgreSQL listens on port `5432`

## Jenkins pipeline

The included `Jenkinsfile` does:

1. Checkout source
2. Run backend tests
3. Run frontend tests
4. Run a Trivy filesystem scan
5. Build backend and frontend Docker images for security scanning
6. Run Trivy image scans
7. Deploy with Docker Compose on the `app` VM
8. Run a smoke test against `/api/health`

## Trivy on Jenkins

To use the new scan stages, install Trivy on the `jenkins` VM before running the pipeline.

Example on Ubuntu:

```bash
sudo apt install -y wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt update
sudo apt install -y trivy
trivy --version
```

## Jenkins VM idea

Your `Vagrantfile` already defines:

- `jenkins` VM at `192.168.56.10`
- `app` VM at `192.168.56.11`

A simple flow is:

1. Install Jenkins, Git, Node.js, and Docker on the `jenkins` VM.
2. Install Docker and Docker Compose on the `app` VM.
3. Let Jenkins pull this repo and run the pipeline on the machine that has Docker access.

If you want, the next step can be adding:

- provisioning scripts for both VMs
- automatic Jenkins installation
- automatic Docker installation
- a real deployment step from `jenkins` VM to `app` VM over SSH

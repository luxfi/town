# Lux Town

### Pre Requisites
- Docker

### Local Setup

> Clone Lux Town
```bash
git clone https://github.com/luxdefi/luxtown.git
```

> Install and start your 👷‍ Hardhat chain
```bash
cd luxtown
yarn
yarn chain
```

> Start Docker and Local Graph Node
- The Docker container provides PostgreSQL and IPFS
- Make sure you Docker engine is running
- The first command spins up the container
- The second command builds and starts Graph Node separately
- The Graph Node connects to PostgreSQL and IPFS
```bash
yarn graphnode:docker
yarn graphnode:start
```

> Start the Lux Town Subgraph
```bash
yarn subgraph:start
```


<p align="center">
  <img height="100px" src="./assets/logo.png" align="center" alt="Kaggle Badge" />
  <h3 align="center">Kaggle Badge</h3>
  <p align="center">Add dynamically generated Kaggle Tier & Medals on your GitHub profile</p>
</p>

<p align="center">
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/competition/light" />
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/dataset/light" />
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/notebook/light" />
</p>

<p align="center">
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/simple/subinium" />
</p>

---

## Quick Start

Replace `{username}` with your Kaggle username.

### Simple Badge

```md
![Kaggle](https://road-to-kaggle-grandmaster.vercel.app/api/simple/{username})
```

### Detailed Badge

```md
![Competition](https://road-to-kaggle-grandmaster.vercel.app/api/badges/{username}/competition)
![Dataset](https://road-to-kaggle-grandmaster.vercel.app/api/badges/{username}/dataset)
![Notebook](https://road-to-kaggle-grandmaster.vercel.app/api/badges/{username}/notebook)
```

---

## Examples

### Simple Badge

| User | Badge |
|------|-------|
| subinium | ![subinium](https://road-to-kaggle-grandmaster.vercel.app/api/simple/subinium) |
| ttagu99 | ![ttagu99](https://road-to-kaggle-grandmaster.vercel.app/api/simple/ttagu99) |

### Detailed Badge (Dark)

<p>
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/competition" />
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/dataset" />
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/notebook" />
</p>

### Detailed Badge (Light)

Add `/light` at the end for light theme:

```md
![Competition](https://road-to-kaggle-grandmaster.vercel.app/api/badges/{username}/competition/light)
```

<p>
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/competition/light" />
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/dataset/light" />
  <img src="https://road-to-kaggle-grandmaster.vercel.app/api/badges/subinium/notebook/light" />
</p>

---

## API Reference

### Simple Badge
```
https://road-to-kaggle-grandmaster.vercel.app/api/simple/{username}
```

### Detailed Badge
```
https://road-to-kaggle-grandmaster.vercel.app/api/badges/{username}/{category}
https://road-to-kaggle-grandmaster.vercel.app/api/badges/{username}/{category}/light
```

**Categories:** `competition`, `dataset`, `notebook`

---

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/subinium/kaggle-badge)

---

## License

Original design licenses for tiers, medals and colors are owned by Kaggle.

MIT License - feel free to use and modify.

import { atom } from "recoil"
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({ key: 'recoil-persist' })

export const cartState = atom(
  {
    key: "cartState",
    default: [],
    effects_UNSTABLE: [persistAtom],
  }
)
import Image from "next/image";
import { FormEvent, useEffect, useRef } from "react";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avatarExample from "../assets/users-avatar-example.png";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";

interface HomeProps {
  poolCount?: number;
  guessCount?: number;
}

export default function Home(props: HomeProps) {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log("montado");

    return () => {
      console.log("desmontado");
    };
  }, []);

  async function createPool(e: FormEvent) {
    e.preventDefault();
    try {
      const post = await api.post("/pool", {
        title: inputRef.current.value,
      });

      await navigator.clipboard.writeText(post.data);
      alert("Bolão criado. Código foi copiado para a área de transferência");
      inputRef.current.value = ""
    } catch (error) {
      alert("Falha ao criar seu bolão. Tente novamente");
    }
  }

  return (
    <div className="max-w-[1024px] mx-auto grid grid-cols-2 gap-28 items-center h-screen">
      <main>
        <Image src={logoImg} alt="Logo NLW"></Image>

        <h1 className="text-amber-100 font-bold leading-tight mt-16 text-5xl">
          Crie seu próprio bolão da copa e compartilhe com seus amigos!
        </h1>
        <div className="flex flex-row gap-4 mt-10 items-center">
          <Image src={avatarExample} alt="avateres"></Image>
          <strong className="text-gray-100 text-xl">
            <span className="text-green-600">+8000</span> pessoas já estão
            apostando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex flex-row gap-2 mb-5">
          <input
            className="flex-1 px-6 py-4 rounded bg-slate-900 border-gray-600 text-cyan-50"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            aria-label="Qual o nome do seu bolão?"
            ref={inputRef}
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black rounded border-black px-6 py-4 font-bold text-sm uppercase hover:bg-yellow-200"
          >
            Criar bolão
          </button>
        </form>
        <p className="text-amber-100 opacity-75 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-evenly ">
          <div className="flex gap-6 ">
            <Image src={iconCheck} alt=""></Image>
            <div className="flex flex-col">
              <span className="text-yellow-400 text-2xl">
                {props.poolCount}
              </span>
              <span className="text-amber-100">bolões rolando</span>
            </div>
          </div>
          <div className="flex gap-6">
            <Image src={iconCheck} alt=""></Image>
            <div className="flex flex-col">
              <span className="text-yellow-400 text-2xl">
                {props.guessCount}
              </span>
              <span className="text-amber-100">Palpites feitos</span>
            </div>
          </div>
        </div>
      </main>
      <aside>
        <Image
          src={appPreviewImg}
          alt="Two cellphones whith the app mobile on screen"
          quality={20}
        />
      </aside>
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCount, guessCount] = await Promise.all([
    api.get("pool/count"),
    api.get("guess/count"),
  ]);

  return {
    props: {
      poolCount: poolCount.data.count,
      guessCount: guessCount.data.count,
    },
  };
};

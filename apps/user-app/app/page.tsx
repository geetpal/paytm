import Image from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

import {PrismaClient} from "@repo/db/client";

const client = new PrismaClient();

export default function Home() {
  return (
<div className="text-5xl">
  Hi there
</div>
  );
}
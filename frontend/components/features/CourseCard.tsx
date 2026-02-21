import styles from "@/styles/CourseCard.module.css";
import Link from "next/link";

interface CourseCardProps {
    id: string;
    title: string;
    category: string;
    price: string;
}

export default function CourseCard({ id, title, category, price }: CourseCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imagePlaceholder}></div>
            <div className={styles.content}>
                <span className={styles.category}>{category}</span>
                <h3 className={styles.coursetitle}>{title}</h3>
                <div className={styles.footer}>
                    <span className={styles.price}>{price}</span>
                    <Link href={`/courses/${id}`}>
                        <button className={styles.enrollbtn}>Enroll Now</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

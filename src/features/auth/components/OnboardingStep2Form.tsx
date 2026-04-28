"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { LONG_PRESS_DURATION, DELETE_ANIMATION_DURATION } from "@/constants/config";

const DEFAULT_SUBJECTS = [""];
const DEFAULT_SET = new Set(DEFAULT_SUBJECTS);

const MAX_SUBJECTS = 9;
const MAX_NAME_LENGTH = 12;

type Subject = {
  id: number;
  name: string;
  level: string;
  nameEdited: boolean;
  levelEdited: boolean;
};

export default function OnboardingStep2Form() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>(
    DEFAULT_SUBJECTS.map((name, i) => ({
      id: i,
      name,
      level: "중",
      nameEdited: false,
      levelEdited: false,
    }))
  );

  const [maxReached, setMaxReached] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [isPressingUI, setIsPressingUI] = useState(false);
  const [focusedId, setFocusedId] = useState<number | null>(null);

  const [inputWidths, setInputWidths] = useState<Record<number, number>>(
    Object.fromEntries(
      DEFAULT_SUBJECTS.map((name, i) => [i, Math.max(72, name.length * 18 + 28)])
    )
  );

  const subjectIdCounter = useRef(DEFAULT_SUBJECTS.length);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const prevNames = useRef<Record<number, string>>(
    Object.fromEntries(DEFAULT_SUBJECTS.map((name, i) => [i, name]))
  );

  const levels = ["하", "중", "상"];

  const getTextWidth = (text: string) => Math.max(72, text.length * 18 + 28);

  const updateWidth = (id: number, value: string) => {
    setInputWidths((prev) => ({ ...prev, [id]: getTextWidth(value) }));
  };

  const handleNameBlur = (index: number) => {
    const id = subjects[index].id;
    const value = inputRefs.current[id]?.value.trim();

    if (value !== undefined) {
      const newName = value || prevNames.current[id];

      // 중복 체크
      const isDuplicate = subjects.some((s, i) => i !== index && s.name === newName && newName !== '');
      if (isDuplicate) {
        setDuplicateError(true);
        inputRefs.current[id]!.value = prevNames.current[id];
        updateWidth(id, prevNames.current[id]);
        return;
      }

      setDuplicateError(false);
      prevNames.current[id] = newName;

      setSubjects((prev) =>
        prev.map((s, i) => i === index ? { ...s, name: newName, nameEdited: true } : s)
      );

      updateWidth(id, newName);

      if (inputRefs.current[id]) {
        inputRefs.current[id]!.value = newName;
      }
    }
  };

  const handleLevelChange = (index: number, level: string) => {
    setSubjects((prev) =>
      prev.map((s, i) => i === index ? { ...s, level, levelEdited: true } : s)
    );
  };

  const handleAddSubject = () => {
    if (subjects.length >= MAX_SUBJECTS) {
      setMaxReached(true);
      return;
    }

    const newId = subjectIdCounter.current++;
    setMaxReached(false);
    setDuplicateError(false);

    setSubjects((prev) => [
      ...prev,
      { id: newId, name: "", level: "중", nameEdited: false, levelEdited: false },
    ]);

    setInputWidths((prev) => ({ ...prev, [newId]: 72 }));
    prevNames.current[newId] = "";
  };

  const handleLongPressStart = (index: number) => {
    isLongPress.current = false;
    setIsPressingUI(true);

    const id = subjects[index].id;
    setFocusedId(null);
    inputRefs.current[id]?.blur();

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setRemovingId(id);

      setTimeout(() => {
        handleDelete(index);
      }, DELETE_ANIMATION_DURATION);
    }, LONG_PRESS_DURATION);
  };

  const handleLongPressEnd = () => {
    setIsPressingUI(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDelete = (index: number) => {
    const id = subjects[index].id;
    delete inputRefs.current[id];
    delete prevNames.current[id];

    setSubjects((prev) => prev.filter((_, i) => i !== index));
    setInputWidths((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    setRemovingId(null);
    setMaxReached(false);
    setDuplicateError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    router.push("/onboarding/step3");
  };

  const columns: Subject[][] = [];
  for (let i = 0; i < subjects.length; i += 3) {
    columns.push(subjects.slice(i, i + 3));
  }

  const lastColumnFull = subjects.length % 3 === 0;

  const renderSubjectItem = (subject: Subject, index: number) => (
    <div
      key={subject.id}
      className={`flex items-center gap-2 ${removingId === subject.id ? "animate-delete" : ""}`}
    >
      <input
        ref={(el) => { inputRefs.current[subject.id] = el; }}
        defaultValue={subject.name}
        placeholder="과목명"
        maxLength={MAX_NAME_LENGTH}
        onChange={(e) => updateWidth(subject.id, e.target.value)}
        onBlur={() => {
          setFocusedId(null);
          handleNameBlur(index);
        }}
        onClick={() => {
          if (isLongPress.current) return;

          const id = subject.id;
          const currentValue = inputRefs.current[id]?.value || "";

          if (DEFAULT_SET.has(currentValue)) {
            prevNames.current[id] = currentValue;
            inputRefs.current[id]!.value = "";
            updateWidth(id, "");
          }
        }}
        onFocus={(e) => {
          if (isLongPress.current) {
            e.target.blur();
            return;
          }
          setFocusedId(subject.id);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          handleLongPressStart(index);
        }}
        onPointerUp={handleLongPressEnd}
        onPointerLeave={handleLongPressEnd}
        className={`text-sm text-center focus:outline-none bg-transparent placeholder:text-white/30 ${
          subject.nameEdited ? "text-white" : "text-white/55"
        }`}
        style={{
          height: "42px",
          minWidth: "72px",
          width: `${inputWidths[subject.id] || 72}px`,
          border: "1px solid rgba(255, 255, 255, 0.55)",
          borderRadius: "12px",
          padding: "0 12px",
          transition: "all 0.2s ease",
          cursor: isPressingUI ? "default" : focusedId === subject.id ? "text" : "default",
        }}
      />

      <div className="relative">
        <select
          value={subject.level}
          onChange={(e) => handleLevelChange(index, e.target.value)}
          className={`text-sm focus:outline-none appearance-none pr-7 pl-3 ${
            subject.levelEdited || subject.nameEdited ? "text-white" : "text-white/55"
          }`}
          style={{
            height: "42px",
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.55)",
            borderRadius: "12px",
            width: "72px",
          }}
        >
          {levels.map((level) => (
            <option key={level} value={level} style={{ backgroundColor: "var(--color-select-bg)" }}>
              {level}
            </option>
          ))}
        </select>

        <Image
          src="/images/icon/school-toggle.svg"
          alt="열기"
          width={16}
          height={16}
          style={{ width: 16, height: 16 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              unoptimized
            />
      </div>
    </div>
  );

  const renderAddButton = () => (
    <button
      type="button"
      onClick={handleAddSubject}
      className="text-brand-green-400 text-sm px-4 flex items-center justify-center whitespace-nowrap"
      style={{
        height: "42px",
        border: "1px solid var(--color-brand-green-400)",
        borderRadius: "12px",
        minWidth: "100px",
      }}
    >
      추가하기 +
    </button>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 mx-auto"
      style={{ width: "fit-content", minWidth: "400px" }}
    >
      <div className="flex flex-col gap-3">
        <Image src="/images/logo.svg" alt="범딧불 로고" width={40} height={40} />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">
            {"{userName}"} 님의 과목별 성적을 입력해주세요.
          </h1>
          <p className="text-xs text-white/55">과목명을 길게 누르면 삭제됩니다.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-8 items-start">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-3">
              {column.map((subject, rowIndex) => {
                const index = colIndex * 3 + rowIndex;
                return renderSubjectItem(subject, index);
              })}

              {colIndex === columns.length - 1 &&
                !lastColumnFull &&
                subjects.length < MAX_SUBJECTS &&
                renderAddButton()}
            </div>
          ))}

          {lastColumnFull && subjects.length < MAX_SUBJECTS && (
            <div className="flex flex-col gap-3">{renderAddButton()}</div>
          )}
        </div>

        {maxReached && <ErrorMessage message="과목 추가는 최대 9개까지 가능합니다." />}
        {duplicateError && <ErrorMessage message="이미 존재하는 과목명입니다." />}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs text-white/55">일정 생성에 반영되는 만큼 정확하게 입력해주세요.</p>
        <p className="text-xs text-white/55">기본과목은 선택하지 않으면 자동으로 미입력 처리됩니다.</p>
      </div>

      <Button type="submit" variant="primary">다음으로</Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step3")}
          className="text-sm text-white/35 hover:text-white/60 transition-colors"
        >
          나중에 하기
        </button>
        <p className="text-sm">
          <span className="text-white">2</span>
          <span className="text-white/55">/3</span>
        </p>
      </div>
    </form>
  );
}
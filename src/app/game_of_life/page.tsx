"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useInterval } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

const randomizeMatrixContent = (matrixSize: number): boolean[][] => {
    const matrix = Array.from({ length: matrixSize }, () =>
        Array.from({ length: matrixSize }, () => false)
    );

    return matrix.map((row) => {
        return row.map(() => {
            return Math.random() > 0.5;
        });
    });
};

export default function Page() {
    const [isGameRunning, setIsGameRunning] = useState<boolean>(true);
    const [matrixSize, setMatrixSize] = useState<number>(10); // [5, 20]
    const [gameIterationSpeed, setGameIterationSpeed] = useState<number>(200); // ms, [50, 300]
    const [gameState, setGameState] = useState<boolean[][]>(
        randomizeMatrixContent(matrixSize)
    );

    const gameIteration = () => {
        if (!isGameRunning) return;

        setGameState((actualGameState) => {
            return actualGameState.map((row: boolean[], rowIndex: number) => {
                return row.map((cell: boolean, cellIndex: number) => {
                    const neighboursCount: number = getNeighboursCount(
                        actualGameState,
                        rowIndex,
                        cellIndex
                    );

                    if (!cell && neighboursCount === 3) return true;
                    else if (
                        cell &&
                        neighboursCount !== 2 &&
                        neighboursCount !== 3
                    )
                        return false;
                    else return cell;
                });
            });
        });
    };

    const getNeighboursCount = (
        actualGameState: boolean[][],
        rowIndex: number,
        cellIndex: number
    ) => {
        let neighboursCount = 0;

        // Ligne du dessus
        if (
            actualGameState[rowIndex - 1] &&
            actualGameState[rowIndex - 1][cellIndex - 1]
        )
            neighboursCount++;
        if (
            actualGameState[rowIndex - 1] &&
            actualGameState[rowIndex - 1][cellIndex]
        )
            neighboursCount++;
        if (
            actualGameState[rowIndex - 1] &&
            actualGameState[rowIndex - 1][cellIndex + 1]
        )
            neighboursCount++;

        // Même ligne
        if (
            actualGameState[rowIndex] &&
            actualGameState[rowIndex][cellIndex - 1]
        )
            neighboursCount++;
        if (
            actualGameState[rowIndex] &&
            actualGameState[rowIndex][cellIndex + 1]
        )
            neighboursCount++;

        // Ligne du dessous
        if (
            actualGameState[rowIndex + 1] &&
            actualGameState[rowIndex + 1][cellIndex - 1]
        )
            neighboursCount++;
        if (
            actualGameState[rowIndex + 1] &&
            actualGameState[rowIndex + 1][cellIndex]
        )
            neighboursCount++;
        if (
            actualGameState[rowIndex + 1] &&
            actualGameState[rowIndex + 1][cellIndex + 1]
        )
            neighboursCount++;

        return neighboursCount;
    };

    useEffect(() => {
        if (matrixSize < gameState.length) {
            setGameState((prevState) => {
                const resizedState = prevState.slice(0, matrixSize).map((row) => {
                    return row.slice(0, matrixSize);
                });
                return resizedState;
            });
        } else {
            setGameState((prevState) => {
                const resizedState = prevState.map((row) => {
                    const newRow = [...row];
                    newRow.length = matrixSize;
                    newRow.fill(false, row.length);
                    return newRow;
                });

                const newRows = Array.from({ length: matrixSize - prevState.length }, () =>
                    Array.from({ length: matrixSize }, () => false)
                );

                return [...resizedState, ...newRows];
            });
        }
    }, [gameState.length, matrixSize]);

    useInterval(gameIteration, gameIterationSpeed);

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full max-w-5xl flex flex-row justify-around py-5 px-2 space-x-6 items-center">
                <div className="flex flex-row justify-center space-x-2">
                <Button
                    onClick={() => setIsGameRunning((prevState) => !prevState)}
                >
                    {isGameRunning ? <FaPause /> : <FaPlay />}
                </Button>
                <Button
                    onClick={() =>
                        setGameState(randomizeMatrixContent(matrixSize))
                    }
                >
                    Randomize
                </Button>
                </div>

                <div className="flex flex-1 flex-col space-y-1">
                    <label htmlFor="game-iteration-speed" className="flex-2">
                        Game iteration speed (ms)
                    </label>
                    <div className="flex flex-row space-x-2">
                        <span>50</span>
                        <Slider
                            id="game-iteration-speed"
                            defaultValue={[gameIterationSpeed]}
                            min={50}
                            max={300}
                            step={25}
                            onValueChange={(value) => setGameIterationSpeed(value[0])}
                        />
                        <span>300</span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col space-y-1">
                    <label htmlFor="grid-size" className="flex-2">
                        Grid size
                    </label>
                    <div className="flex flex-row space-x-2">
                        <span>5</span>
                        <Slider
                            id="game-iteration-speed"
                            defaultValue={[matrixSize]}
                            min={5}
                            max={20}
                            step={1}
                            onValueChange={(value) => setMatrixSize(value[0])}
                        />
                        <span>20</span>
                    </div>
                </div>
            </div>

            <div className="aspect-square max-w-5xl w-full">
                <div className="flex flex-col">
                    {gameState.map((row, rowIndex) => {
                        return (
                            <div
                                key={`row-${rowIndex}`}
                                className={"flex flex-row"}
                            >
                                {row.map((cell, cellIndex) => (
                                    <div
                                        key={`cell-${rowIndex}-${cellIndex}`}
                                        className={clsx(
                                            "aspect-square border-2 border-slate-800 flex-1 box-border m-1",
                                            {
                                                "bg-white": cell,
                                            }
                                        )}
                                    ></div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

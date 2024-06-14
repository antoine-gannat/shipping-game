import { dispatch } from "..";
import { db } from "../../database";
import { IDbTimer } from "../../database/types";
import { ID } from "../../types";

/**
 * Timers are used to schedule actions in the future.
 * They are stored in the database and are loaded on app start.
 * It's possible to add a new one by callng `setTimer`.
 *
 * They will be auto-cleaned when they finish.
 */

type TimerActionKind = "shipArrival";

type TimerActionPayload = {
  shipArrival: { journeyId: ID };
};

type TimerAction<K extends TimerActionKind> = (
  payload: TimerActionPayload[K]
) => void;

const actions: Record<TimerActionKind, TimerAction<TimerActionKind>> = {
  shipArrival: ({ journeyId }) => {
    dispatch("journeyEnd", { journeyId });
  },
};

const activeTimeouts: Record<ID, NodeJS.Timeout> = {};

export const initTimers = async () =>
  db.timers.toArray().then((timers) => {
    timers.forEach(createTimer);
  });

export const setTimer = (timer: Omit<IDbTimer, "id">) => {
  db.timers.add(timer).then((id) => createTimer({ ...timer, id }));
};

const createTimer = (timer: IDbTimer) => {
  const timeLeft = timer.endTime - Date.now();
  // remove actions which have finished
  if (timeLeft <= 0) {
    removeTimer(timer.id);
    executeTimerAction(timer);
    return;
  }
  // otherwise, create a timeout for the remaining time
  const timeout = setTimeout(() => {
    removeTimer(timer.id);
    executeTimerAction(timer);
  }, timeLeft);

  activeTimeouts[timer.id] = timeout;
};

const removeTimer = (id: ID) => {
  db.timers.delete(id);
  clearTimeout(activeTimeouts[id]);
};

const executeTimerAction = (timer: IDbTimer) => {
  const action = actions[timer.action as TimerActionKind];
  if (!action) {
    console.warn("Unknown timer action", timer.action);
    return;
  }
  // We have to cast the action properties because there is no way to know
  // what they are after being loaded from the DB.
  action(timer.actionProperties as typeof action.arguments);
};
